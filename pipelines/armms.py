import weaviate
import weaviate.classes.config as wc

from langchain_ollama import OllamaLLM
from langchain_ollama import OllamaEmbeddings

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_openai import OpenAI

from langchain_weaviate.vectorstores import WeaviateVectorStore

from langchain.chains import RetrievalQA, RetrievalQAWithSourcesChain
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter


from blueprints.function_calling_blueprint import Pipeline as FunctionCallingBlueprint


from typing import List, Union, Generator, Iterator, Optional
from schemas import OpenAIChatMessage
import os
import asyncio
import time

from dotenv import load_dotenv

import requests
import zipfile
import io

import jwt

load_dotenv()

STORAGE_SEVER = "https://armms-storage.aorief.com"
CACHE_EXPIRY = 1800 # 30 minutes

# Generate a signed JWT
def generate_jwt(user_id):
    payload = {
        "id": user_id,  # Include the provided ID
        "iat": int(time.time()),  # Issued at time
        "exp": int(time.time()) + 3600,  # Expiration time (1 hour from now)
    }
    token = jwt.encode(payload, os.environ["ARMMS_SECRET"], algorithm="HS256")
    return token

# Send a GET request with the Bearer token
def send_request(url, user_id):
    # Generate the JWT
    token = generate_jwt(user_id)
    
    # Set up headers
    headers = {
        "Authorization": f"Bearer {token}",
    }
    
    # Send the GET request
    response = requests.get(url, headers=headers)

    print(f"Response Status: {response.status_code}")
    print(f"Response Headers: {response.headers}")

    return response

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
                    'key': os.environ["OPENAI_KEY"]
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

        # Small Cache for faster responses
        # TODO will not be needed when only updated documents are received
        self.cache = {}
    
    def from_documents(self, docs):
        return WeaviateVectorStore.from_documents(docs, self.embeddings, client=self.client)

    def get_retriever(self, oauth_sub):
        
        # Check if there is a value in the cache and if it is valid... if so, return it
        if oauth_sub in self.cache and self.cache[oauth_sub]["exp"] > int(time.time()):
            return self.cache[oauth_sub]["db"].as_retriever()
        
        print("Nothing found in cache. Retrieving data.")
        # Retrieve the ZIP file from the server
        response = send_request(STORAGE_SEVER+"/download_all/", oauth_sub)
        zip_file = zipfile.ZipFile(io.BytesIO(response.content))

        print("Documents retrieved from storage server")

        pdf_files = [zip_file.extract(file) for file in zip_file.namelist() if file.endswith('.pdf')]

        # Extract text content from each PDF
        pages = [] 
        for pdf_path in pdf_files:
            loader = PyPDFLoader(pdf_path)
            for page in loader.lazy_load():
                pages.append(page)
        
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(pages)

        db = self.from_documents(docs)
        print("Documents loaded and ready to to be used.")

        entry = {
            "exp": int(time.time()) + CACHE_EXPIRY,
            "db": db
        }

        self.cache[oauth_sub] = entry
        return db.as_retriever()
        

    def import_data(self, documents):
        self.db.add_documents(documents)
        print("Documents successfully added to Weaviate index.")

    def close_connection(self): # TODO this is probably not correct
        self.client.close()

class Chain():
    def __init__(self, model, store):                
        self.model = model
        self.store = store

        template = """You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise. Always start with saying I am happy to assist you
        Question: {question}
        Context: {context}
        Answer:
        """
        self.prompt = ChatPromptTemplate.from_template(template)

    
    def get_rag_chain(self, retriever):
        rag_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | self.prompt
            | self.model.llm
            | StrOutputParser()
        )
        return rag_chain



# Step 4: Main function to run the application
class Pipeline:

    def __init__(self):
        pass
        
    async def on_startup(self):
        self.model = Model("OpenAI")
        self.store = Store(self.model)

        self.chain = Chain(self.model, self.store)
    
    async def on_shutdown(self):
        self.store.close_connection()

    async def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        print(f"pipe:{__name__}")

        # Add user to the body... will be used in the pipe
        body["user_additional_info"] = user
        print(body)
        return body

    def pipe(
        self, user_message: str, model_id: str, messages: List[dict], body: dict
    ) -> Union[str, Generator, Iterator]:
        # This is where you can add your custom RAG pipeline.
        # Typically, you would retrieve relevant information from your knowledge base and synthesize it to generate a response.
        

        # Get user
        oauth_sub = body["user_additional_info"]["oauth_sub"].split("@")[1]

        # Restore data
        retriever = self.store.get_retriever(oauth_sub)

        # Perform RAG
        rag = self.chain.get_rag_chain(retriever)
        answer = rag.invoke(user_message)
        print("Answer:", answer)


        return answer

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


