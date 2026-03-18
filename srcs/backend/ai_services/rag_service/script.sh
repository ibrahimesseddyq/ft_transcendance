#!/bin/bash

. /app/.venv/bin/activate
. /vault/secrets/config
. /vault/secrets/jwt
. /vault/secrets/other
cd /app/app

PYTHONPATH=/app/app /root/.local/bin/uv run uvicorn main:app --port 3003 --host 0.0.0.0
