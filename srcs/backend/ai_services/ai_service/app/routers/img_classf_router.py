from fastapi import APIRouter, File, HTTPException, UploadFile
from services.profile_classifier.img_recog import predict

router = APIRouter()


@router.post("/api/ai/classify")
async def recognite(file: UploadFile = File(...)):

    labels = ["non valid profile", "valid profile"]

    try:
        image = await file.read()
        result = predict(image)

        return {"class": labels[result]}

    except Exception:
        raise HTTPException(status_code=500, detail="Image recognition service failed")
