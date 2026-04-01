#!/bin/bash

# Shared environment helpers for IWE shell scripts.
# Source-of-truth: .exocortex.env created by setup.sh / maintained by update.sh.

EXOCORTEX_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXOCORTEX_REPO_DIR="$(cd "$EXOCORTEX_LIB_DIR/../.." && pwd)"
EXOCORTEX_ENV_FILE="${EXOCORTEX_ENV_FILE:-$EXOCORTEX_REPO_DIR/.exocortex.env}"

load_shell_exports_if_present() {
    local env_file="$1"
    if [ -f "$env_file" ]; then
        while IFS= read -r line; do
            case "$line" in \#*|"") continue ;; esac

            local key="${line%%=*}"
            local value="${line#*=}"

            key="$(printf '%s' "$key" | tr -d '[:space:]')"
            [ -z "$key" ] && continue

            printf -v "$key" '%s' "$value"
            export "$key"
        done < "$env_file"
    fi
}

load_shell_exports_if_present "$EXOCORTEX_ENV_FILE"

resolve_workspace_dir() {
    if [ -n "${WORKSPACE_DIR:-}" ]; then
        printf '%s\n' "$WORKSPACE_DIR"
        return
    fi

    printf '%s\n' "$(cd "$EXOCORTEX_REPO_DIR/.." && pwd)"
}

resolve_claude_project_slug() {
    if [ -n "${CLAUDE_PROJECT_SLUG:-}" ]; then
        printf '%s\n' "$CLAUDE_PROJECT_SLUG"
        return
    fi

    printf '%s\n' "$(resolve_workspace_dir | tr '/' '-')"
}

resolve_claude_memory_dir() {
    printf '%s\n' "${CLAUDE_MEMORY_DIR:-$HOME/.claude/projects/$(resolve_claude_project_slug)/memory}"
}

load_aist_env_if_present() {
    load_shell_exports_if_present "$HOME/.config/aist/env"
}

load_wakatime_api_key_if_present() {
    if [ -n "${WAKATIME_API_KEY:-}" ]; then
        return
    fi

    load_aist_env_if_present

    if [ -n "${WAKATIME_API_KEY:-}" ]; then
        return
    fi

    if [ -f "$HOME/.wakatime.cfg" ]; then
        WAKATIME_API_KEY="$(
            awk -F'=' '
                /^[[:space:]]*api_key[[:space:]]*=/ {
                    gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2)
                    print $2
                    exit
                }
            ' "$HOME/.wakatime.cfg"
        )"

        if [ -n "${WAKATIME_API_KEY:-}" ]; then
            export WAKATIME_API_KEY
        fi
    fi
}
