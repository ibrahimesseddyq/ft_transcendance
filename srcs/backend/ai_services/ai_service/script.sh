#!/bin/bash

. /app/.venv/bin/activate

cd /app/app
/app/.venv/bin/uvicorn main:app --port 3002 --host 0.0.0.0