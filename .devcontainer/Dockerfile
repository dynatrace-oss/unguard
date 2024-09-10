FROM mcr.microsoft.com/vscode/devcontainers/base:bookworm as kind

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN export DEBIAN_FRONTEND=noninteractive

COPY docker.sh /tmp/scripts/
RUN chmod +x /tmp/scripts/docker.sh

# update the container
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install zsh ca-certificates gnupg jq -y && \
    apt-get autoremove -y && \
    apt-get clean -y

# Install kubectl
RUN curl -sSL -o /usr/local/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
    && chmod +x /usr/local/bin/kubectl

# Install Helm
RUN curl -s https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash -

# Install kind
RUN KIND_RELEASE=$(curl --silent "https://api.github.com/repos/kubernetes-sigs/kind/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/') \
    && curl -sSL -o /usr/local/bin/kind https://kind.sigs.k8s.io/dl/$KIND_RELEASE/kind-linux-amd64 \
    && chmod +x /usr/local/bin/kind

RUN /tmp/scripts/docker.sh

# change ownership of the home directory
RUN chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}

WORKDIR /home/${USERNAME}
USER ${USERNAME}

ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]
CMD [ "sleep", "infinity" ]