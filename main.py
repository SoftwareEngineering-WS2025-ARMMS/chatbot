import mysql.connector
from langchain.llms import Ollama
from langchain.vectorstores import Weaviate
from langchain.embeddings import OllamaEmbeddings
from langchain.chains import RetrievalQA
from langchain.schema import Document
from mysql.connector import Error
import weaviate
import os

# Define MySQL database configuration
MYSQL_CONFIG = {
    'host': '127.0.0.1:12345', # TODO can ports be done automatically
    'user': 'bookstack',
    'password': 'secretpassword', # TODO how to do this securely
    'database': 'bookstack',
}

# Define Weaviate client configuration
WEAVIATE_CONFIG = {
    'url': 'http://localhost:8989',
}

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
        cursor.execute("SELECT id, chapter_id, title, content FROM pages;")
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
                metadata={"type": "book", "title": book_title, "id": book["id"]}
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
                        "id": chapter["id"],
                        "book_id": book["id"]
                    }
                )
                documents.append(chapter_doc)

                # Include pages under each chapter
                for page in pages_by_chapter.get(chapter["id"], []):
                    page_title = page['title']
                    page_content = page['content'] or ""
                    
                    # Add each page as a Document with metadata linking to its chapter and book
                    page_doc = Document(
                        page_content=f"Page: {page_title}\n\n{page_content}",
                        metadata={
                            "type": "page",
                            "title": page_title,
                            "id": page["id"],
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

# Step 2: Connect to Weaviate and persist the indexed data
def setup_weaviate_index(documents):
    """
    Sets up a Weaviate index with the TinyLlama embeddings for the BookStack content.
    This function ensures that books, chapters, and pages are structured with metadata
    that links each document to its respective book and chapter.
    """
    client = weaviate.Client(
        url=WEAVIATE_CONFIG["url"],
        auth_client_secret=weaviate.AuthApiKey(api_key=WEAVIATE_CONFIG.get("api_key"))
    )
    
    # Define or update the Weaviate schema to reflect hierarchical structure
    class_schema = {
        "class": "BookStackContent",
        "properties": [
            {"name": "title", "dataType": ["string"]},
            {"name": "content", "dataType": ["text"]},
            {"name": "type", "dataType": ["string"]},          # New field to denote book, chapter, or page
            {"name": "book_id", "dataType": ["string"]},       # Links each document to its book
            {"name": "chapter_id", "dataType": ["string"]}     # Links pages to their chapters
        ]
    }
    
    # Check if class already exists; if not, create it
    if not client.schema.exists("BookStackContent"):
        client.schema.create_class(class_schema)

    # Initialize Weaviate vector store with TinyLlama embeddings
    vectorstore = Weaviate(client, "BookStackContent", embeddings)

    # Add documents to Weaviate, with persistent indexing
    vectorstore.add_documents(documents)
    print("Documents successfully added to Weaviate index.")

# Step 3: Set up Ollama model with LangChain for querying
def setup_qa_chain():
    ollama_llm = Ollama(model="tinyllama", base_url="http://localhost:7896")
    client = weaviate.Client(**WEAVIATE_CONFIG)
    vectorstore = Weaviate(client, "BookStackContent", OpenAIEmbeddings())
    return RetrievalQA.from_chain_type(llm=ollama_llm, chain_type="stuff", retriever=vectorstore.as_retriever())

# Step 4: Main function to run the application
def main():
    # Fetch data from MySQL and store in Weaviate
    documents = fetch_bookstack_data()
    if documents:
        setup_weaviate_index(documents)
        print("Data successfully ingested into Weaviate index.")

    # Set up QA chain for querying
    qa_chain = setup_qa_chain()

    # Run a simple query loop
    print("Ask questions about the BookStack content (type 'exit' to quit):")
    while True:
        query = input("Your question: ")
        if query.lower() == 'exit':
            break
        answer = qa_chain.run(query)
        print("Answer:", answer)

if __name__ == "__main__":
    print("Hello") # Not calling main. Want simple __main__ to test CD pipeline
