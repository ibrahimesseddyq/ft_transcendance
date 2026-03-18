#!/bin/bash

. /app/.venv/bin/activate

PYTHONPATH=/app/app /root/.local/bin/uv run uvicorn main:app --port 3002 --host 0.0.0.0