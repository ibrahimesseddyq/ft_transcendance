#!/bin/bash

. /app/.venv/bin/activate

cd /app/app

/root/.local/bin/uv run uvicorn app.main:app --port 3003 --host 0.0.0.0 --workers 4