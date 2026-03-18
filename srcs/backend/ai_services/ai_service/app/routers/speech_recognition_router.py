from fastapi import APIRouter, File, UploadFile
from services.speech_recognition.speech_recognate import recognate

router = APIRouter()


@router.post("/api/ai/recognate")
async def recognition_endpoint(audio: UploadFile = File(...)):

    audio_file = "/tmp/" + audio.filename
    print("audio file name: ", audio_file)

    with open(audio_file, "wb") as f:
        f.write(await audio.read())

    text = recognate(audio_file)
    return {"text": text}
