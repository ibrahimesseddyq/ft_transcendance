from fastapi import APIRouter, File, UploadFile
from services.profile_classifier.img_recog import predict

router = APIRouter()


@router.post("/classify")
async def recognite(file: UploadFile = File(...)):
    labels = ["non valid profile", "valid profile"]
    image = await file.read()
    result = predict(image)
    return {"class": labels[result]}
