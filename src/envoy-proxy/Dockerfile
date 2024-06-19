FROM --platform=linux/amd64 envoyproxy/envoy:v1.23.0

RUN apt-get update && \
    apt-get install -y curl python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

USER envoy:envoy
ADD --chown=envoy:envoy config /etc/envoy/unguard

EXPOSE 8080
EXPOSE 8081

CMD ["-c", "/etc/envoy/unguard/envoy-config.yaml"]
