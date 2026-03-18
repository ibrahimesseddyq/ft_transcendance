import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from limiter.limiter import limiter
from routers import llm_rag_router
from services.document_index import index_documents
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

load_dotenv()

app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL", "https://13.36.189.126"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.on_event("startup")
def startup_documents():

    index_documents()


@app.get("/api/rag/health")
def health_check():
    return {"status": "ok"}


app.include_router(llm_rag_router.router)
