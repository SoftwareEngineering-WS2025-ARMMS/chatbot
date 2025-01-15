import weaviate
import weaviate.classes.config as wc
import json

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
from pydantic import BaseModel


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
import os

import jwt

load_dotenv()

# Generate a signed JWT
def generate_jwt(user_id, secret):
    payload = {
        "sub": user_id,  # Include the provided ID
        "iat": int(time.time()),  # Issued at time
        "exp": int(time.time()) + 3600,  # Expiration time (1 hour from now)
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

# Send a GET request with the Bearer token
def send_request(url, user_id, secret):
    # Generate the JWT
    token = generate_jwt(user_id, secret)
    
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
    def __init__(self, model_type, key):
        self.set_up_model(model_type, key)

    def update_config(self, model_type, key):
        self.set_up_model(model_type, key)
    
    def set_up_model(self, model_type, key):
        match model_type:
            case "OpenAI":
                self.embedding = OpenAIEmbeddings(model="text-embedding-3-small", 
                                                  api_key=key)
                
                self.llm = ChatOpenAI(
                                    model="gpt-4o-mini",
                                    temperature=0,
                                    max_tokens=None,
                                    timeout=None,
                                    max_retries=2,
                                    api_key=key
                                    # organization="...",
                                    # other params...
                            )

class Store():
    def __init__(self, model: Model, storage_server, weaviate_port, cache_expiry=1800):
        self.configure_store(model, storage_server, weaviate_port, cache_expiry)

    def update_config(self, model, storage_server, weaviate_port, cache_expiry=1800):
        self.configure_store(model, storage_server, weaviate_port, cache_expiry)

    def configure_store(self, model, storage_server, weaviate_port, cache_expiry=1800):
        ## Create Client
        self.client = weaviate.connect_to_local(port=weaviate_port) 
        self.model = model

        # Server to retrieve documents from
        self.storage_server = storage_server

        # Small Cache for faster responses
        self.cache_expiry = cache_expiry
        self.cache = {}
    
    
    def from_documents(self, docs):
        return WeaviateVectorStore.from_documents(docs, self.model.embedding, client=self.client)

    def get_retriever(self, 
                      oauth_sub,
                      secret):
        
        # Check if there is a value in the cache and if it is valid... if so, return it
        if oauth_sub in self.cache and self.cache[oauth_sub]["exp"] > int(time.time()):
            last_update = self.cache[oauth_sub]["last_update"]
            documents = self.cache[oauth_sub]["docs"]
        else:
            last_update = 0
            documents = []

        # Retrieve the ZIP file from the server
        response = send_request(f"{self.storage_server}/download_all_after/{time.strftime('%d-%m-%Y-%H:%M:%S', time.gmtime(last_update))}", 
                                oauth_sub,
                                secret)

        if response.status_code != 200:
            raise RuntimeError("Could not retrieve documents from storage.")

        zip_file = zipfile.ZipFile(io.BytesIO(response.content))

        print("Documents retrieved from storage server")

        pdf_files = [zip_file.extract(file) for file in zip_file.namelist() if file.endswith('.pdf')]

        # Extract text content from each PDF

        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

        # Extract text content from each PDF
        pages = [] 
        for pdf_path in pdf_files:
            loader = PyPDFLoader(pdf_path)
            for page in loader.lazy_load():
                pages.append(page)
        
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(pages)

        documents.extend(docs)

        db = self.from_documents(documents)
        print("Documents loaded and ready to to be used.")

        entry = {
            "exp": int(time.time()) + self.cache_expiry,
            "last_update": int(time.time()),
            "docs": documents
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

        #Initial prompt: You are an assistant for question-answering tasks. 
        #Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise. 
        #Always start with saying I am happy to assist you
        template = """Du bist ein digitaler Assistent für die Mitarbeiter eines Vereins. Dein Ziel ist es, die Mitarbeiter bei ihren bürokratischen Aufgaben zu unterstützen, indem du auf relevante Dokumente zugreifst und Fragen präzise beantwortest. Du hast Zugriff auf Protokolle, ToDo-Listen, Termine, Regelungen und andere vereinsbezogene Dokumente und verwendest diese, um Anfragen zuverlässig zu bearbeiten. Dabei erklärst du immer transparent, welche Dokumente du durchsucht hast und wie du zu deiner Antwort gekommen bist. Dein Verhalten:
        Begrüßung: Du beginnst jede Konversation mit:"Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?"
        Antworten auf Fragen: Du erklärst, wie du die Antwort gefunden hast:"Um dir das zu beantworten, habe ich das Dokument [Dokumentname] durchsucht und folgende Informationen gefunden: ..."
        Nachfragen: Du fragst immer nach, ob deine Antwort ausreicht:"Konnte ich deine Frage damit beantworten?"
        Erneute Überprüfung: Wenn deine Antwort nicht zufriedenstellend war, überprüfst du alle relevanten Dokumente erneut und versuchst es noch einmal.
        Abschlussgespräch: Wenn die Frage beantwortet wurde, antwortest du:"Schön, dass ich dich hiermit unterstützen konnte! Hast du noch weitere Fragen oder Anliegen?"
        Verabschiedung: Wenn es keine weiteren Fragen gibt:"Ich wünsche dir einen schönen Tag, bis zum nächsten Mal!"

        Beispielkonversation
        Du:
        Hallo, ich freue mich, dich bei deiner heutigen Tätigkeit im Verein zu unterstützen. Wie kann ich dir helfen?
        Mitarbeiter:
        Wann findet das nächste Vorstandstreffen statt?
        Du:
        Um dir das zu beantworten, habe ich die aktuellen Termine durchsucht.Im Kalender habe ich gefunden, dass das nächste 
        Vorstandstreffen am 20. Februar um 18:00 Uhr im Hauptgebäude stattfindet.Konnte ich deine Frage damit beantworten?
        Mitarbeiter:
        Ja, danke!
        Du:
        Schön, dass ich dich hiermit unterstützen konnte! Hast du noch weitere Fragen oder Anliegen?
        Mitarbeiter:
        Nein, das war’s.
        Du:
        Ich wünsche dir einen schönen Tag, bis zum nächsten Mal!

        Die Beispielskonversation ist nur ein Beispiel, du musst dich nicht wörtlich daran halten. Die sind jetzt nur als tip gegeben
        
        Gebe nur deine Antwort zurück.

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

    class Valves(BaseModel):
        CACHE_EXPIRY_SECONDS : int = int(os.environ["CACHE_EXPIRY_SECONDS"])
        STORAGE_SERVER : str = os.environ["STORAGE_SERVER"]
        OPENAI_KEY : str = os.environ["OPENAI_KEY"]
        ARMMS_SECRET : str = os.environ["ARMMS_SECRET"]
        WEAVIATE_PORT : int = int(os.environ["WEAVIATE_PORT"])


    def __init__(self):
        self.name = os.environ["PIPELINE_NAME"]
        self.id = os.environ["PIPELINE_NAME"]
        self.valves = self.Valves()

        # To allow this to be a valve, class Model should allow other types
        # Note that each model requires other libraries to be set up!!
        self.model_type = "OpenAI" 
        pass
        
    async def on_startup(self):
        self.model = Model(self.model_type, self.valves.OPENAI_KEY)
        self.store = Store(self.model, self.valves.STORAGE_SERVER, self.valves.WEAVIATE_PORT, self.valves.CACHE_EXPIRY_SECONDS)

        self.chain = Chain(self.model, self.store)
    
    async def on_shutdown(self):
        self.store.close_connection()
    
    async def on_valves_updated(self) -> None:
        """This function is called when the valves are updated."""

        print(f"on_valves_updated:{__name__}")
        self.model.update_config(self.model_type, self.valves.OPENAI_KEY)
        self.store.update_config(self.model, self.valves.STORAGE_SERVER, int(self.valves.WEAVIATE_PORT), int(self.valves.CACHE_EXPIRY_SECONDS))

    async def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        print(f"pipe:{__name__}")

        # Add user to the body... will be used in the pipe
        body["user_additional_info"] = user
        print(body)
        return body

    def pipe(
        self, user_message: str, model_id: str, messages: List[dict], body: dict
    ) -> Union[str, Generator, Iterator]:
        
        print(messages)

        # This is where you can add your custom RAG pipeline.
        # Typically, you would retrieve relevant information from your knowledge base and synthesize it to generate a response.
        
        # Should not happen if Open-WebUI plays nice
        if not "user_additional_info" in body or "oauth_sub" not in body["user_additional_info"]:
            return "Error: No user provided by the inlet. This is a severe issue, please contact your administrator."

        # Get user
        oauth_sub = body["user_additional_info"]["oauth_sub"]

        if oauth_sub==None or "@" not in oauth_sub:
            return "Error: Malformed oauth_sub. Please contact your administrator."
        
        oauth_sub = oauth_sub.split("@")[1]

        # Restore data
        try: 
            retriever = self.store.get_retriever(
                oauth_sub,
                self.valves.ARMMS_SECRET
                )
        except RuntimeError:
            return "Error: Could not retrieve files from storage. Have you signed in using the Dashboard?"

        # Perform RAG
        rag = self.chain.get_rag_chain(retriever)
        
        # TODO this may not always fit in the context window
        answer = rag.invoke(json.dumps(messages[:-10]))
        print("Answer:", answer)

        return answer

# TODO fix main
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


