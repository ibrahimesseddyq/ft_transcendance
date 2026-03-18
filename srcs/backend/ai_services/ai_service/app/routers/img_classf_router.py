import os

from dotenv import load_dotenv
from fastapi import APIRouter, File, Header, HTTPException, UploadFile
from services.profile_classifier.img_recog import predict

router = APIRouter()

load_dotenv()

API_KEY = os.getenv("SECRET_API_KEY")


@router.post("/api/ai/classify")
async def recognite(file: UploadFile = File(...), api_key: str = Header(None)):

    if API_KEY != api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    labels = ["non valid profile", "valid profile"]

    try:
        image = await file.read()
        result = predict(image)

        return {"class": labels[result]}

    except Exception:
        raise HTTPException(status_code=500, detail="Img recognition service failed")
