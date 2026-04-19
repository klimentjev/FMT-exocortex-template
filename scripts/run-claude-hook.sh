#!/usr/bin/env bash
# Runs a hook script from $HOME/.iwe/claude-hooks (installed via scripts/install-claude-hooks.ps1).
# Keeps hook bodies out of .claude/hooks so Cursor does not open them as project files.
set -euo pipefail
name="${1:?usage: run-claude-hook.sh <script.sh>}"
root="${CLAUDE_HOOKS_HOME:-$HOME/.iwe/claude-hooks}"
exec "$root/$name"
