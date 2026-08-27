#!/usr/bin/env bash
# Обёртка над update.sh: после любого прогона нормализует .claude/settings.json под Cursor (run-claude-hook).
# Используйте вместо прямого ./update.sh если после обновления снова открываются вкладки хуков.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export SCRIPT_DIR="$ROOT"
export WORKSPACE_DIR="$(dirname "$ROOT")"

ec=0
bash "$ROOT/update.sh" "$@" || ec=$?

if [ -f "$ROOT/scripts/run-post-update-cursor-normalize.sh" ]; then
  echo ""
  echo "[Cursor] Пост-обработка hooks (гарантированно после update.sh)..."
  SCRIPT_DIR="$ROOT" WORKSPACE_DIR="$WORKSPACE_DIR" bash "$ROOT/scripts/run-post-update-cursor-normalize.sh" || true
fi

exit "$ec"
