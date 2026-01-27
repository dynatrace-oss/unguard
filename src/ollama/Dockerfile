FROM ollama/ollama:0.15.2

RUN ollama serve & \
  sleep 5 && \
  ollama pull llama3.2 && \
  ollama pull nomic-embed-text && \
  pkill ollama

EXPOSE 11434
CMD ["ollama", "serve"]
