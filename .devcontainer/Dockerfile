FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ENV DEBIAN_FRONTEND=noninteractive

# uvの導入
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libuv1-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# uvを導入
RUN curl -LsSf https://astral.sh/uv/install.sh | bash
# uv の PATH を確実に通す（ログイン/非ログイン両対応）
ENV PATH="/root/.local/bin:${PATH}"
RUN echo 'export PATH="$HOME/.local/bin:$PATH"' >> /etc/bash.bashrc

# Voltaの導入

RUN curl https://get.volta.sh | bash
# Volta の PATH を確実に通す（ログイン/非ログイン

ENV VOLTA_HOME="/root/.volta"
ENV PATH="$VOLTA_HOME/bin:${PATH}"
RUN echo 'export VOLTA_HOME="$HOME/.volta"' >> /etc/bash.bashrc
RUN echo 'export PATH="$VOLTA_HOME/bin:$PATH"' >> /etc/bash.bashrc

# 作業ディレクトリ（compose の volume と一致させる）
WORKDIR /workspaces/C0de-hackathon2025

# ログインシェルにして /etc/profile.d を確実に読む
SHELL ["/bin/bash", "-l", "-c"]
CMD ["bash"]
