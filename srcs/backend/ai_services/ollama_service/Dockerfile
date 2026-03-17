FROM ollama/ollama

RUN	ollama serve & \
	sleep 7 && \
	ollama pull llama3.2:3b && \
	ollama pull mxbai-embed-large && \
	pkill ollama

ENTRYPOINT [ "ollama", "serve" ]
