#!/bin/bash

. /app/.venv/bin/activate
. /vault/secrets/config
. /vault/secrets/jwt
. /vault/secrets/other
cd /app/app
/app/.venv/bin/uvicorn main:app --port 3002 --host 0.0.0.0