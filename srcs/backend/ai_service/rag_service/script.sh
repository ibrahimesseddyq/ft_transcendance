#!/bin/bash

cd /ai_service/app

. /.venv/bin/activate

ollama serve &

/root/.local/bin/uv run uvicorn main:app --port 8001 --host 0.0.0.0 --reload
