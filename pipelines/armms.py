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

from blueprints.function_calling_blueprint import Pipeline as FunctionCallingBlueprint

from mysql.connector import Error
import os

from typing import List, Union, Generator, Iterator, Optional
from schemas import OpenAIChatMessage
import os
import asyncio

from dotenv import load_dotenv

import requests
import zipfile
import io


load_dotenv()

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



# Step 4: Main function to run the application
class Pipeline:

    def __init__(self):
        pass

    class Valves(FunctionCallingBlueprint.Valves):
        OpenAI_API_KEY: str = ""
        pass
        

    async def on_startup(self):
        self.model = Model("OpenAI")
        self.store = Store(self.model)

        self.chain = Chain(self.model, self.store)
        self.rag = self.chain.get_rag_chain()
    
    async def on_shutdown(self):
        self.store.close_connection()

    async def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        print(f"pipe:{__name__}")
        print(body)
        print(user)

        return body

    def pipe(
        self, user_message: str, model_id: str, messages: List[dict], body: dict
    ) -> Union[str, Generator, Iterator]:
        # This is where you can add your custom RAG pipeline.
        # Typically, you would retrieve relevant information from your knowledge base and synthesize it to generate a response.
        
        print(messages)
        print(user_message)

        answer = self.rag.invoke(user_message)
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


