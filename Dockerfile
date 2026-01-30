FROM debian:bookworm-slim

RUN apt update && apt install -y \
							vim \
							python3 \
							python3-requests \
							python3-uvicorn \
							python3-fastapi

COPY main.py main.py

ENTRYPOINT ["python3", "main.py"]
