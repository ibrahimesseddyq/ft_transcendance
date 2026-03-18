from fastapi import FastAPI
from routers import img_classf_router, speech_recognition_router, text_moderation_router
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    img_classf_router,
    speech_recognition_router,
    text_moderation_router,
)

app = FastAPI()

origins = [
    "http://frontend:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/ai/health")
def healtch_check():
    return {"status": "ok"}


app.include_router(img_classf_router.router)

app.include_router(text_moderation_router.router)

app.include_router(speech_recognition_router.router)
