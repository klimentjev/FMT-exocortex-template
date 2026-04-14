#!/bin/bash
# Claude Code → WakaTime heartbeat hook
# Sends heartbeats to track AI coding time per project.
# Events: UserPromptSubmit, PostToolUse, Stop

INPUT=$(cat)
CWD=$(echo "$INPUT" | node -e "try { console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).cwd || ''); } catch(e) {}")
EVENT=$(echo "$INPUT" | node -e "try { console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).hook_event_name || ''); } catch(e) {}")
TOOL=$(echo "$INPUT" | node -e "try { console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).tool_name || ''); } catch(e) {}")

# Detect project from git or folder name
if [ -n "$CWD" ] && [ -d "$CWD" ]; then
  PROJECT=$(cd "$CWD" && git config --local remote.origin.url 2>/dev/null | sed 's#.*/\([^.]*\)#\1#;s#\.git$##')
  PROJECT=${PROJECT:-$(basename "$CWD")}
else
  PROJECT="Unknown"
fi

# Category based on event/tool
CATEGORY="ai coding"
if [ "$EVENT" = "PostToolUse" ]; then
  case "$TOOL" in
    WebSearch|WebFetch) CATEGORY="researching" ;;
    Read|Grep|Glob)    CATEGORY="code reviewing" ;;
    Edit|Write)        CATEGORY="coding" ;;
  esac
fi

# Send heartbeat in background (non-blocking, silent)
(~/.wakatime/wakatime-cli \
  --entity-type app \
  --entity "Claude Code" \
  --category "$CATEGORY" \
  --project "$PROJECT" \
  --plugin "claude-code-wakatime/0.1.0" \
  --write \
  >/dev/null 2>&1 &)

exit 0
