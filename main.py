from fastapi import FastAPI, Request
import json
import requests
import uvicorn

app = FastAPI()

@app.post("/moderate")
async def moderation(request: Request):
    body = await request.body()
    response = requests.post('https://api.sightengine.com/1.0/text/check.json',
                             {
                                'text':body,
                                'lang':'en',
                                'mode':'rules,ml'
                            })
    json_response = json.loads(response.text)
    return json_response


if __name__ == '__main__':
    uvicorn.run('main:app', host='127.0.0.1', port=8000)

