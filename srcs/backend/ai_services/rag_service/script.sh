#!/bin/bash

cd /ai_service/app

. /.venv/bin/activate

/root/.local/bin/uv run uvicorn main:app --port 3003 --host 0.0.0.0 --reload --workers 4
