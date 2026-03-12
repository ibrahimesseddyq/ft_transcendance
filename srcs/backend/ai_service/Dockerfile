FROM debian:bookworm-slim

RUN apt update && apt install -y \
	python3 \
	curl \
	libgl1 \
	libglib2.0-0 \
	libxcb1

COPY requirements.txt requirements.txt

COPY app/ app/

RUN curl -LsSf https://astral.sh/uv/install.sh | sh

RUN . $HOME/.local/bin/env

RUN /root/.local/bin/uv venv
RUN . .venv/bin/activate
RUN /root/.local/bin/uv pip install -r requirements.txt

WORKDIR /app

ENTRYPOINT ["/root/.local/bin/uv", "run", "uvicorn", "main:app"]
