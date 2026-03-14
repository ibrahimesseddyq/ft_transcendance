from fastapi import APIRouter, Body
from services.chat_moderation.main import moderate

router = APIRouter()


@router.post("/moderate")
async def moderation_endpoint(text: str = Body(..., media_type="text/plain")):
    result = moderate(text)

    warn_labels = []
    block_labels = []
    for label, score in result.items():
        if score >= 0.25 and score < 0.4:
            warn_labels.append(label)
        elif score >= 0.4:
            block_labels.append(label)

    if block_labels:
        return {"action": "Block", "reason": block_labels}
    elif warn_labels:
        return {"action": "Warn", "reason": warn_labels}
    else:
        return {"action": "Allow"}
