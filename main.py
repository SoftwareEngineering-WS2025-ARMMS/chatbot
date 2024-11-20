import mysql.connector

import weaviate
import weaviate.classes.config as wc

from langchain_ollama import OllamaLLM
from langchain_ollama import OllamaEmbeddings

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_openai import OpenAI

import weaviate
from langchain_weaviate.vectorstores import WeaviateVectorStore

from langchain.chains import RetrievalQA, RetrievalQAWithSourcesChain
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

# Define MySQL database configuration
MYSQL_CONFIG = {
    'host': 'localhost', # TODO can ports be done automatically
    'port': '12345',
    'user': 'bookstack',
    'password': os.getenv("MYSQL_PASS"), # TODO how to do this securely
    'database': 'bookstack',
}

# Define Weaviate client configuration
WEAVIATE_CONFIG = {
    'url': 'http://se-weaviate.aorief.com',
}

# Created in order to simplify the switch between OpenAI and tinyllama
class Model():
    def __init__(self, model_type):
        match model_type:
            case "Ollama":
                OLLAMA_CONFIG = {
                'url': 'http://localhost:7869'
                }
                self.embedding = OllamaEmbeddings(base_url = OLLAMA_CONFIG["url"], model="tinyllama")
                self.llm = OllamaLLM(model="tinyllama", base_url="http://localhost:7896")

            case "OpenAI":
                OPENAI_CONFIG = {
                    'key': os.getenv("OPENAI_KEY") 
                }
                self.embedding = OpenAIEmbeddings(model="text-embedding-3-small", api_key=OPENAI_CONFIG['key'])
                
                self.llm = ChatOpenAI(
                                    model="gpt-4o-mini",
                                    temperature=0,
                                    max_tokens=None,
                                    timeout=None,
                                    max_retries=2,
                                    api_key=OPENAI_CONFIG['key']
                                    # organization="...",
                                    # other params...
                            )

class Store():
    def __init__(self, model: Model):
        ## Create Client
        self.client = weaviate.connect_to_local(port=8989)
        self.embeddings = model.embedding

        # TODO consider using multiple vector stores
        # TODO consider multi tenenancy
        self.db = WeaviateVectorStore(self.client, embedding=self.embeddings, index_name="Document", text_key="content") 
    
    def import_data(self, documents):
        self.db.add_documents(documents)
        print("Documents successfully added to Weaviate index.")

    def close_connection(self): # TODO this is probably not correct
        self.client.close()

class Chain():
    def __init__(self, model, store):                
        self.model = model
        self.store = store

        template = """You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
        Question: {question}
        Context: {context}
        Answer:
        """
        self.prompt = ChatPromptTemplate.from_template(template)

    
    def get_rag_chain(self):
        rag_chain = (
            {"context": self.store.db.as_retriever(), "question": RunnablePassthrough()}
            | self.prompt
            | self.model.llm
            | StrOutputParser()
        )
        return rag_chain

        

# Step 1: Connect to MySQL database and fetch data
def fetch_bookstack_data():
    """
    Connects to the MySQL BookStack database, fetches all books, chapters, and pages,
    and organizes them in a list of Document objects for LangChain, preserving the
    hierarchical structure of BookStack (Book -> Chapter -> Page).
    """
    documents = []
    try:
        # Connect to MySQL database
        connection = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = connection.cursor(dictionary=True)

        # Step 1: Fetch all books
        cursor.execute("SELECT id, name, description FROM books;")
        books = cursor.fetchall()

        # Step 2: Fetch all chapters and map them by book_id
        cursor.execute("SELECT id, book_id, name, description FROM chapters;")
        chapters = cursor.fetchall()
        chapters_by_book = {}
        for chapter in chapters:
            chapters_by_book.setdefault(chapter["book_id"], []).append(chapter)

        # Step 3: Fetch all pages and map them by chapter_id
        cursor.execute("SELECT id, chapter_id, name, text FROM pages;")
        pages = cursor.fetchall()
        pages_by_chapter = {}
        for page in pages:
            pages_by_chapter.setdefault(page["chapter_id"], []).append(page)

        # Step 4: Organize data into Document objects
        for book in books:
            book_title = book['name']
            book_desc = book['description'] or ""
            book_content = f"Book: {book_title}\n\n{book_desc}"

            # Add each book as a top-level Document
            book_doc = Document(
                page_content=book_content,
                metadata={"type": "book", "title": book_title, "book_id": book["id"]}
            )
            documents.append(book_doc)

            # Include chapters under each book
            for chapter in chapters_by_book.get(book["id"], []):
                chapter_title = chapter['name']
                chapter_desc = chapter['description'] or ""
                chapter_content = f"Chapter: {chapter_title}\n\n{chapter_desc}"

                # Add each chapter as a Document with metadata linking to its book
                chapter_doc = Document(
                    page_content=chapter_content,
                    metadata={
                        "type": "chapter",
                        "title": chapter_title,
                        "chapter_id": chapter["id"],
                        "book_id": book["id"]
                    }
                )
                documents.append(chapter_doc)

                # Include pages under each chapter
                for page in pages_by_chapter.get(chapter["id"], []):
                    page_title = page['name']
                    page_content = page['text'] or ""
                    
                    # Add each page as a Document with metadata linking to its chapter and book
                    page_doc = Document(
                        page_content=f"Page: {page_title}\n\n{page_content}",
                        metadata={
                            "type": "page",
                            "title": page_title,
                            "page_id": page["id"],
                            "chapter_id": chapter["id"],
                            "book_id": book["id"]
                        }
                    )
                    documents.append(page_doc)

    except Error as e:
        print(f"Error fetching data from MySQL: {e}")
    finally:
        # Ensure database connections are closed properly
        if connection.is_connected():
            cursor.close()
            connection.close()

    return documents



# Step 4: Main function to run the application
def main():
    # Fetch data from MySQL and store in Weaviate
    
    model = Model("OpenAI")
    store = Store(model)
    
    #documents = fetch_bookstack_data()
    #store.import_data(documents)

    chain = Chain(model, store)
    rag = chain.get_rag_chain()

    # Run a simple query loop
    print("Ask questions about the BookStack content (type 'exit' to quit):")
    while True:
        query = input("Your question: ")
        if query.lower() == 'exit':
            break
        answer =rag.invoke(query)
        print("Answer:", answer)
    
    store.close_connection()

if __name__ == "__main__":
    main()