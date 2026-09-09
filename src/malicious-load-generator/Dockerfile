FROM locustio/locust:2.9.0

# install curl
USER root
# bullseye's live security repo was decommissioned at EOL; pin apt to a frozen
# snapshot instead of bumping locustio/locust:2.9.0, since Unguard intentionally
# stays on old, vulnerable runtimes for security training.
RUN printf 'deb https://snapshot.debian.org/archive/debian/20260831T000000Z bullseye main\ndeb https://snapshot.debian.org/archive/debian-security/20260831T000000Z bullseye-security main\n' > /etc/apt/sources.list \
    && apt-get -o Acquire::Check-Valid-Until=false update \
    && apt-get install -y --no-install-recommends curl

COPY --chown=locust:locust . .
RUN chmod +x loadgen.sh
ENTRYPOINT ./loadgen.sh