FROM debian:bookworm-slim

RUN apt update && apt install -y \
	python3 \
	curl

COPY requirements.txt requirements.txt

RUN	apt-get install zstd -y && \
	curl -fsSL https://ollama.com/install.sh | sh

RUN	ollama serve &

RUN	ollama serve & \
	sleep 6 && \
	ollama pull llama3.2:1b && ollama pull mxbai-embed-large && \
	curl -LsSf https://astral.sh/uv/install.sh | sh && \
	. $HOME/.local/bin/env && \
	/root/.local/bin/uv venv && \
	. .venv/bin/activate && \
	/root/.local/bin/uv pip install -r requirements.txt

COPY --chmod=755 script.sh script.sh

ENTRYPOINT [ "./script.sh" ]
