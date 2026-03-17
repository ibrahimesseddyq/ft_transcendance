from fastapi import APIRouter
from pydantic import BaseModel
from services.llm_rag.generate import generate

router = APIRouter()


class GenerationRequest(BaseModel):
    text: str


@router.post("/api/ai/generate")
async def generation_endpoint(request: GenerationRequest):
    result = generate(request.text)
    return result
