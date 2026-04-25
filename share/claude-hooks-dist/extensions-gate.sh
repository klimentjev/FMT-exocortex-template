#!/usr/bin/env bash
# Extensions Gate — PreToolUse (Edit|Write). Blocks direct edits to L1 skills/protocol memory.
# Customizations belong in extensions/*.md. See CLAUDE.md (Extensions Gate).
# author_mode in params.yaml disables this gate.
set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

if [ "$TOOL" != "Edit" ] && [ "$TOOL" != "Write" ]; then
  echo '{}'
  exit 0
fi

if [ -z "$FILE_PATH" ]; then
  echo '{}'
  exit 0
fi

IWE_ROOT="${IWE_ROOT:-${HOME}/IWE}"
if [ -f "$IWE_ROOT/params.yaml" ] && grep -qE '^[[:space:]]*author_mode:[[:space:]]*true' "$IWE_ROOT/params.yaml" 2>/dev/null; then
  echo '{}'
  exit 0
fi

norm=$(printf '%s' "$FILE_PATH" | sed 's/\\/\//g')

if echo "$norm" | grep -qE '(^|/)\.claude/skills/'; then
  cat <<'EOF'
{"decision": "block", "reason": "EXTENSIONS GATE: use extensions/*.md, not .claude/skills/ (L1). Exception: author_mode: true in params.yaml."}
EOF
  exit 0
fi

if echo "$norm" | grep -qE '(^|/)memory/protocol-[^/]+\.md$'; then
  cat <<'EOF'
{"decision": "block", "reason": "EXTENSIONS GATE: do not edit memory/protocol-*.md directly; use extensions/*.md. Exception: author_mode: true in params.yaml."}
EOF
  exit 0
fi

echo '{}'
exit 0