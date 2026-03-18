import os

from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders.directory import DirectoryLoader
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import (
    MarkdownHeaderTextSplitter,
    RecursiveCharacterTextSplitter,
)

load_dotenv()

embedding = OllamaEmbeddings(
    model=os.getenv("OLLAMA_EMBED_MODEL", "mxbai-embed-large"), base_url=os.getenv("OLLAMA_SERVER_URL", "http://localhost:11434")
)

vector_store = Chroma(
    collection_name="company_data_collection", embedding_function=embedding
)


def index_documents():

    loader = DirectoryLoader("rag_data", glob="*.md", loader_cls=TextLoader)
    documents = loader.load()

    header_splitter = MarkdownHeaderTextSplitter([("##", "header")])

    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
    )

    documents_tmp = []
    for doc in documents:
        split_headers = header_splitter.split_text(doc.page_content)
        split_document = recursive_splitter.split_documents(split_headers)
        for spl_doc in split_document:
            spl_doc.metadata.update(doc.metadata)
        documents_tmp.extend(split_document)

    vector_store.add_documents(documents=documents_tmp)
