#!/usr/bin/env bash
# Strip .claude/hooks from Claude Code permissions.additionalDirectories.
# If that path is listed, Cursor/VS Code on Windows often opens hook scripts as editor tabs.
set -euo pipefail

strip_one() {
    local f="$1"
    [ -f "$f" ] || return 0

    if command -v jq >/dev/null 2>&1; then
        if ! jq -e '(.permissions.additionalDirectories // []) | (index(".claude/hooks") != null) or (index("./.claude/hooks") != null)' "$f" >/dev/null 2>&1; then
            return 0
        fi
        jq '.permissions.additionalDirectories = ((.permissions.additionalDirectories // []) | map(select(. != ".claude/hooks" and . != "./.claude/hooks")))' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
        echo "  ✓ Убран .claude/hooks из additionalDirectories — $f"
        return 0
    fi

    if command -v node >/dev/null 2>&1; then
        if _STRIP_CLAUDE_JSON="$f" node <<'NODE'
const fs = require("fs");
const p = process.env._STRIP_CLAUDE_JSON;
if (!p) process.exit(1);
const d = JSON.parse(fs.readFileSync(p, "utf8"));
if (!d.permissions) d.permissions = {};
const ad = d.permissions.additionalDirectories;
if (!Array.isArray(ad)) process.exit(0);
const bad = new Set([".claude/hooks", "./.claude/hooks"]);
const next = ad.filter((x) => !bad.has(x));
if (next.length === ad.length) process.exit(0);
d.permissions.additionalDirectories = next;
fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
console.log("  ✓ Убран .claude/hooks из additionalDirectories — " + p);
NODE
        then
            return 0
        fi
    fi

    if command -v python3 >/dev/null 2>&1; then
        if ! python3 -c "import sys" >/dev/null 2>&1; then
            echo "  ○ strip-claude-hooks-additional-dirs: python3 недоступен, пропуск $f" >&2
            return 0
        fi
        _STRIP_CLAUDE_JSON="$f" python3 <<'PY'
import json, sys, os
path = os.environ.get("_STRIP_CLAUDE_JSON")
if not path:
    sys.exit(1)
with open(path, encoding="utf-8") as fp:
    d = json.load(fp)
perms = d.get("permissions") or {}
ad = perms.get("additionalDirectories")
if not isinstance(ad, list):
    sys.exit(0)
bad = {".claude/hooks", "./.claude/hooks"}
if not any(x in bad for x in ad):
    sys.exit(0)
perms["additionalDirectories"] = [x for x in ad if x not in bad]
d["permissions"] = perms
with open(path, "w", encoding="utf-8") as fp:
    json.dump(d, fp, indent=2)
    fp.write("\n")
print(f"  ✓ Убран .claude/hooks из additionalDirectories — {path}")
PY
        return 0
    fi

    echo "  ○ strip-claude-hooks-additional-dirs: нет jq, node и python3 — пропуск $f" >&2
}

for f in "$@"; do
    [ -n "$f" ] || continue
    strip_one "$f"
done
