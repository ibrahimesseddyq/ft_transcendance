FROM debian:bookworm-slim

RUN apt update && apt install -y \
	vim \
	python3 \
	python3-venv \
	pip

RUN python3 -m venv vflow

COPY requirements.txt requirements.txt

COPY app/ app/

RUN vflow/bin/pip install -r requirements.txt

WORKDIR /app

ENTRYPOINT ["uvicorn", "main:app"]
