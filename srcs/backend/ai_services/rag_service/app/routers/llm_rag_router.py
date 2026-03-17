import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from jose import JWTError, jwt
from limiter.limiter import limiter
from pydantic import BaseModel
from services.generate import generate

router = APIRouter()


class GenerationRequest(BaseModel):
    text: str


load_dotenv()

SECRET_KEY = os.getenv("SECRET_TOKEN")


def jwt_verify(request: Request):

    token = request.headers.get("Cookie")

    if token is None:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/api/ai/generate")
@limiter.limit("2/minute")
async def generation_endpoint(
    request: Request, body: GenerationRequest, user=Depends(jwt_verify)
):

    try:
        result = await run_in_threadpool(generate, body.text)
    except Exception:
        raise HTTPException(status_code=500, detail="RAG service failed")

    return result
