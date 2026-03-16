from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    img_classf_router,
    llm_rag_router,
    speech_recognition_router,
    text_moderation_router,
)

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(img_classf_router.router)

app.include_router(text_moderation_router.router)

app.include_router(speech_recognition_router.router)

app.include_router(llm_rag_router.router)

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="127.0.0.1", port=3002, reload=True)
