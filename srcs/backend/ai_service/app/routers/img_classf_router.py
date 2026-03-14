from fastapi import APIRouter, File, UploadFile
from services.profile_classifier.img_recog import predict

router = APIRouter()


@router.post("/api/ai/classify")
async def recognite(file: UploadFile = File(...)):
    labels = ["non valid profile", "valid profile"]
    image = await file.read()
    result = predict(image)
    return {"class": labels[result]}
