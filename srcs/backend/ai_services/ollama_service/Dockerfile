FROM ollama/ollama

RUN apt-get update && apt-get install -y curl && \
    ollama serve & \
    until curl -s http://localhost:11434/api/tags > /dev/null; do \
      echo "Waiting for Ollama server..." && sleep 1; \
    done && \
    echo "Ollama is up! Pulling models..." && \
    ollama pull llama3.2:1b && \
    ollama pull mxbai-embed-large && \
    pkill ollama && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "ollama", "serve" ]
