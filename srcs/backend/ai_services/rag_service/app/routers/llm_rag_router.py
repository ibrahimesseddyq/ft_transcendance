import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
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

    token = request.cookies.get("accessToken")

    if token is None:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")



@router.post("/api/rag/generate")
@limiter.limit("2/minute")
async def generation_endpoint(
    request: Request, body: GenerationRequest, user=Depends(jwt_verify)
):

    async def stream_response():
        try:
            for chunk in generate(body.text):
                yield chunk
        except Exception:
            raise HTTPException(status_code=500, detail="RAG service failed")

    return StreamingResponse(stream_response(), media_type="text/plain")
