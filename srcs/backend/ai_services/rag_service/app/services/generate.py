from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders.directory import DirectoryLoader
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_text_splitters import (
    MarkdownHeaderTextSplitter,
    RecursiveCharacterTextSplitter,
)

llm = ChatOllama(model="llama3.2:1b", num_predict=200, num_ctx=2048)

embedding = OllamaEmbeddings(model="mxbai-embed-large")

vector_store = Chroma(
    collection_name="company_data_collection", embedding_function=embedding
)

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


def generate(prompt):

    vector_docs = vector_store.max_marginal_relevance_search(prompt, k=3, fetch_k=10)

    context = ""
    for doc in vector_docs:
        print(doc.metadata)
        context += (
            "## "
            + doc.metadata.get("header", "")
            + "\n\n"
            + doc.page_content
            + "\n\n- - -\n\n"
        )

    template = [
        (
            "system",
            """You are an IT company assistant.

            You answer questions based only on the context provided bellow.
            If the context doesn't contain informations to answer, respond strictly with: 'I don't know'.
            If the user asks something unrelated to the company, respond strictly with: 'I don't know'.
            Do not guess.

            The context:\n"""
            + context,
        ),
        ("human", prompt),
    ]

    response = llm.invoke(template)

    return response.content

    # for chunk in llm.stream(template):
    #     print(chunk.content, end="", flush=True)
