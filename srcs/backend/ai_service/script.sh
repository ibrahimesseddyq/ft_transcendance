#!/bin/bash

cd /ai_service/app

/root/.local/bin/uv run uvicorn main:app --host 0.0.0.0 --reload
