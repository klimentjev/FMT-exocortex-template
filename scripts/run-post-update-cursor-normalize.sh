#!/usr/bin/env bash
# Нормализует .claude/settings.json для Cursor на Windows:
# hooks: .claude/hooks/foo.sh → bash scripts/run-claude-hook.sh foo.sh
# Убирает .claude/hooks из permissions.additionalDirectories.
#
# Вызывается из update.sh; если update.sh после bootstrap снова «чистый» upstream —
# выполните вручную: bash scripts/run-post-update-cursor-normalize.sh
set -uo pipefail

REPO_ROOT="${SCRIPT_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
WORKSPACE_DIR="${WORKSPACE_DIR:-$(dirname "$REPO_ROOT")}"
JS="$REPO_ROOT/scripts/normalize-claude-settings-cursor.js"

if [ ! -f "$JS" ]; then
  echo "  ○ run-post-update-cursor-normalize: нет $JS"
  exit 0
fi
if ! command -v node >/dev/null 2>&1; then
  echo "  ○ run-post-update-cursor-normalize: установите Node.js"
  exit 0
fi

normalize_ws_line() {
  local line="$1"
  line="${line#WORKSPACE_DIR=}"
  line="${line%%#*}"
  line=$(printf '%s' "$line" | tr -d '\r')
  line="${line#\"}"
  line="${line%\"}"
  line="${line#\'}"
  line="${line%\'}"
  echo "$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
}

paths=("$REPO_ROOT/.claude/settings.json" "$WORKSPACE_DIR/.claude/settings.json")
for ef in "$WORKSPACE_DIR/.exocortex.env" "$REPO_ROOT/.exocortex.env"; do
  [ -f "$ef" ] || continue
  env_ws=$(grep -E '^WORKSPACE_DIR=' "$ef" 2>/dev/null | head -1)
  env_ws="$(normalize_ws_line "$env_ws")"
  [ -n "$env_ws" ] && paths+=("$env_ws/.claude/settings.json")
done

seen=""
run=()
for p in "${paths[@]}"; do
  [ -f "$p" ] || continue
  case " $seen " in *" $p "*) continue ;; esac
  seen="$seen $p"
  run+=("$p")
done

[ ${#run[@]} -eq 0 ] && exit 0
node "$JS" "${run[@]}"
