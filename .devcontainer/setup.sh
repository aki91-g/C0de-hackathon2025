#!/usr/bin/env bash
set -euo pipefail

# =============================================================
# Devcontainer post-create setup script
# - Backend: uv sync で back/.venv を更新
# - Frontend: Volta で最新 Node を入れて pnpm install
# =============================================================

echo "[setup] Start post-create setup..."

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
BACKEND_DIR="$ROOT_DIR/back"
FRONTEND_DIR="$ROOT_DIR/front"

cd "$ROOT_DIR"

has_cmd() { command -v "$1" >/dev/null 2>&1; }

setup_backend() {
  if [[ ! -d "$BACKEND_DIR" || ! -f "$BACKEND_DIR/pyproject.toml" ]]; then
    echo "[python] back/ に pyproject.toml が無いのでスキップします。"
    return 0
  fi
  if ! has_cmd uv; then
    echo "[python] uv が見つかりません。Dockerfile で導入されている前提です。"
    return 1
  fi

  echo "[python] uv sync を実行して仮想環境を整備します..."
  pushd "$BACKEND_DIR" >/dev/null
  uv sync
  popd >/dev/null
}

setup_frontend() {
  if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
    echo "[node] frontend/ に package.json が無いのでスキップします。"
    return 0
  fi
  if ! has_cmd volta; then
    echo "[node] Volta が見つかりません。Dockerfile で導入されている前提です。"
    return 1
  fi

  echo "[node] Volta で最新 Node.js をセットアップします..."
  volta install node@latest || true
  if ! has_cmd pnpm; then
    volta install pnpm@latest || true
  fi

  pushd "$FRONTEND_DIR" >/dev/null
  if [[ -f pnpm-lock.yaml ]]; then
    pnpm install --frozen-lockfile
  else
    pnpm install
  fi
  echo "[node] Node $(node -v), pnpm $(pnpm -v)"
  popd >/dev/null
}

setup_backend
setup_frontend

echo "[setup] Done."
