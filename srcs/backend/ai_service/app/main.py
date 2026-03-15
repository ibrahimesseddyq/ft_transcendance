from fastapi import FastAPI
from routers import img_classf_router, speech_recognition_router, text_moderation_router

app = FastAPI()

app.include_router(img_classf_router.router)

app.include_router(text_moderation_router.router)

app.include_router(speech_recognition_router.router)

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="127.0.0.1", port=3002, reload=True)
