from services.document_index import vector_store


def retreive(prompt):

    vector_docs = vector_store.max_marginal_relevance_search(prompt, k=3, fetch_k=10)

    context = ""
    for doc in vector_docs:
        context += (
            "## " + doc.metadata.get("header", "") + "\n\n" + doc.page_content + "\n\n"
        )

    return context
