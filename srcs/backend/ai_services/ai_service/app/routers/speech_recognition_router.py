import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from jose import JWTError, jwt
from services.speech_recognition.speech_recognate import recognate

router = APIRouter()

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


@router.post("/api/ai/recognate")
async def recognition_endpoint(audio: UploadFile = File(...), user=Depends(jwt_verify)):

    try:
        audio_file = "/tmp/" + audio.filename

        with open(audio_file, "wb") as f:
            f.write(await audio.read())

        text = recognate(audio_file)
        return {"text": text}

    except Exception:
        raise HTTPException(status_code=500, detail="Chat moderation service failed")
