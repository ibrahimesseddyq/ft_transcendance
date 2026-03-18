FROM debian:bookworm-slim

RUN apt update && apt install -y \
	python3 \
	curl
	
COPY requirements.txt requirements.txt

RUN	curl -LsSf https://astral.sh/uv/install.sh | sh && \
. $HOME/.local/bin/env && \
/root/.local/bin/uv venv && \
. .venv/bin/activate && \
/root/.local/bin/uv pip install -r requirements.txt
COPY . .

COPY --chmod=755 script.sh script.sh
WORKDIR /app

ENTRYPOINT [ "./script.sh" ]
