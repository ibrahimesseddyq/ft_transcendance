from fastapi import APIRouter, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from limiter.limiter import limiter
from pydantic import BaseModel
from services.llm_rag.generate import generate

router = APIRouter()


class GenerationRequest(BaseModel):
    text: str


@router.post("/api/ai/generate")
@limiter.limit("2/minute")
async def generation_endpoint(request: Request, body: GenerationRequest):

    try:
        result = await run_in_threadpool(generate, body.text)
    except Exception:
        raise HTTPException(status_code=500, detail="RAG service failed")

    return result
