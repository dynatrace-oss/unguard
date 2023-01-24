FROM locustio/locust:2.9.0

# install curl
USER root
RUN apt-get update
RUN apt-get install -y curl

COPY --chown=locust:locust . .
RUN chmod +x loadgen.sh
ENTRYPOINT ./loadgen.sh