import os

from dotenv import load_dotenv
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from services.chat_moderation.main import moderate

router = APIRouter()

load_dotenv()

API_KEY = os.getenv("SECRET_API_KEY")


class ModerationRequest(BaseModel):
    text: str


@router.post("/api/ai/moderate")
async def moderation_endpoint(request: ModerationRequest, api_key: str = Header(None)):

    if API_KEY != api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    try:
        result = moderate(request.text)

        warn_labels = []
        block_labels = []
        for label, score in result.items():
            if score >= 0.25 and score < 0.4:
                warn_labels.append(label)
            elif score >= 0.4:
                block_labels.append(label)

    except Exception:
        raise HTTPException(status_code=500, detail="Chat moderation service failed")

    if block_labels:
        return {"action": "Block", "reason": block_labels}
    elif warn_labels:
        return {"action": "Warn", "reason": warn_labels}
    else:
        return {"action": "Allow"}
