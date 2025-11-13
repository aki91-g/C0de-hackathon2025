#!/usr/bin/env bash
set -euo pipefail

# =============================================================
# Devcontainer post-create setup script
# - Python: uv で仮想環境作成・依存関係の同期
# - Node.js: Volta + Corepack でパッケージマネージャ選択・依存関係の導入
# - 何度実行しても安全（冪等）
# =============================================================

echo "[setup] Start post-create setup..."

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

has_cmd() { command -v "$1" >/dev/null 2>&1; }

# -----------------------------
# Python setup (via uv)
# -----------------------------
setup_python() {
  if ! has_cmd uv; then
    echo "[python] 'uv' が見つかりません。Dockerfile でインストールされている想定です。スキップします。"
    return 0
  fi

  # venv の場所（リポジトリ直下）
  VENV_DIR=".venv"

  # Python を必要に応じて用意（pyproject がある場合は sync を想定）
  if [[ -f pyproject.toml ]]; then
    echo "[python] pyproject.toml を検出。仮想環境を準備し依存関係を同期します。"
    # 推奨: 利用可能な安定版を確実に用意（失敗しても続行）
    uv python install --default 3.12 || true
    if [[ ! -d "$VENV_DIR" ]]; then
      uv venv "$VENV_DIR"
    fi
    # 仮想環境を使って依存関係を同期
    UV_PYTHON="$(pwd)/$VENV_DIR/bin/python" uv sync || uv sync || true
  elif [[ -f requirements.txt ]]; then
    echo "[python] requirements.txt を検出。仮想環境を準備し依存関係をインストールします。"
    if [[ ! -d "$VENV_DIR" ]]; then
      uv venv "$VENV_DIR"
    fi
    "$VENV_DIR"/bin/python -m pip --version >/dev/null 2>&1 || true
    uv pip install -r requirements.txt || true
  else
    echo "[python] 依存定義（pyproject.toml / requirements.txt）が見つかりません。仮想環境のみ準備します。"
    if [[ ! -d "$VENV_DIR" ]]; then
      uv venv "$VENV_DIR" || true
    fi
  fi

  # VS Code が自動検出しやすいように出力
  if [[ -x "$VENV_DIR/bin/python" ]]; then
    echo "[python] Python: $("$VENV_DIR"/bin/python --version 2>/dev/null || echo unavailable)"
  fi
}

# -----------------------------
# Node.js setup (via Volta + Corepack)
# -----------------------------
setup_node() {
  if ! has_cmd volta; then
    echo "[node] 'volta' が見つかりません。Dockerfile でインストールされている想定です。スキップします。"
    return 0
  fi

  if [[ -f package.json ]]; then
    echo "[node] package.json を検出。Node.js と依存関係を準備します。"
    # LTS をデフォルトに設定（既に設定済みなら何もしない）
    volta install node@latest|| true

    # Corepack を有効化して pnpm / yarn を管理
    if has_cmd corepack; then
      corepack enable || true
    fi

    if [[ -f pnpm-lock.yaml ]]; then
      echo "[node] pnpm-lock.yaml を検出。pnpm を使用します。"
      if has_cmd corepack; then
        corepack prepare pnpm@latest --activate || true
      else
        npm -g i pnpm || true
      fi
      pnpm install || true
    elif [[ -f yarn.lock ]]; then
      echo "[node] yarn.lock を検出。yarn を使用します。"
      if has_cmd corepack; then
        corepack prepare yarn@stable --activate || true
      fi
      yarn install --frozen-lockfile || yarn install || true
    elif [[ -f package-lock.json ]]; then
      echo "[node] package-lock.json を検出。npm を使用します。"
      npm ci || npm install || true
    else
      echo "[node] ロックファイルがありません。npm でインストールします。"
      npm install || true
    fi

    echo "[node] Node: $(node -v 2>/dev/null || echo unavailable)"
    echo "[node] NPM:  $(npm -v 2>/dev/null || echo unavailable)"
  else
    echo "[node] package.json が見つかりません。Node.js セットアップはスキップします。"
  fi
}

# -----------------------------
# Main
# -----------------------------
setup_python
setup_node

echo "[setup] Done."

