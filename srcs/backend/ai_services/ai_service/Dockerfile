FROM debian:bookworm-slim

RUN apt update && apt install -y \
	python3 \
	curl \
	libgl1 \
	libglib2.0-0 \
	libxcb1
WORKDIR /app
COPY requirements.txt requirements.txt

RUN	curl -LsSf https://astral.sh/uv/install.sh | sh && \
	. $HOME/.local/bin/env && \
	/root/.local/bin/uv venv && \
	. .venv/bin/activate && \
	/root/.local/bin/uv pip install -r requirements.txt
COPY . .

COPY --chmod=755 script.sh script.sh

ENTRYPOINT [ "./script.sh" ]
