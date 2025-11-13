#!/usr/bin/env bash
set -euo pipefail

# =============================================================
# Devcontainer post-create setup script
# - Backend: uv sync で back/.venv を更新
# - Frontend: Volta で Node / pnpm を入れて pnpm install
# =============================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
BACKEND_DIR="${ROOT_DIR}/back"
FRONTEND_DIR="${ROOT_DIR}/front"

log() {
  # ログ出力用の簡単なヘルパー
  echo "[setup] $*"
}

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

setup_backend() {
  # back/ 以下に pyproject.toml がないならスキップ
  if [[ ! -d "${BACKEND_DIR}" || ! -f "${BACKEND_DIR}/pyproject.toml" ]]; then
    log "[python] back/ に pyproject.toml が無いのでスキップします。"
    return 0
  fi

  if ! has_cmd uv; then
    log "[python] uv が見つかりません。Dockerfile で導入されている前提です。"
    return 1
  fi

  log "[python] uv sync を実行して仮想環境を整備します..."
  pushd "${BACKEND_DIR}" >/dev/null
  uv sync
  popd >/dev/null
}

ensure_volta() {
  if ! has_cmd volta; then
    log "[node] Volta が見つかりません。Dockerfile で導入されている前提です。"
    return 1
  fi
}

ensure_node() {
  log "[node] Volta で最新 Node.js をセットアップします..."
  # 既に入っていれば Volta 側でよしなにやってくれる
  volta install node@latest
  log "[node] Node version: $(node -v)"
}

ensure_pnpm() {
  # pnpm がコマンドとして存在して、かつ正常に動くかチェック
  if pnpm -v >/dev/null 2>&1; then
    log "[node] pnpm version: $(pnpm -v)"
    return 0
  fi

  log "[node] pnpm がまだ Volta にインストールされていないため、インストールします..."
  volta install pnpm@latest

  # インストール後にもう一度チェック
  if pnpm -v >/dev/null 2>&1; then
    log "[node] pnpm version: $(pnpm -v)"
    return 0
  else
    log "[node] pnpm のインストールに失敗しました。"
    return 1
  fi
}


setup_frontend() {
  # front/ に package.json が無ければスキップ
  if [[ ! -f "${FRONTEND_DIR}/package.json" ]]; then
    log "[node] front/ に package.json が無いのでスキップします。"
    return 0
  fi

  ensure_volta
  ensure_node
  ensure_pnpm

  log "[node] pnpm install を実行します..."
  pushd "${FRONTEND_DIR}" >/dev/null
  if [[ -f pnpm-lock.yaml ]]; then
    pnpm install --frozen-lockfile
  else
    pnpm install
  fi
  log "[node] Node $(node -v), pnpm $(pnpm -v)"
  popd >/dev/null
}

main() {
  log "Start post-create setup..."

  cd "${ROOT_DIR}"

  setup_backend
  setup_frontend

  log "Done."
}

main "$@"
