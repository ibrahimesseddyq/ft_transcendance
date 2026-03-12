from fastapi import FastAPI
from routers import img_classf_router

app = FastAPI()

app.include_router(img_classf_router.router)


# if __name__ == "__main__":
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
