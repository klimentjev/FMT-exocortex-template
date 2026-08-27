#!/usr/bin/env bash
# Normalize Claude hook settings to avoid opening hook scripts as editor tabs:
# 1) Strip .claude/hooks from permissions.additionalDirectories
# 2) Rewrite direct ".claude/hooks/<name>.sh" commands to wrapper:
#    "bash scripts/run-claude-hook.sh <name>.sh"
set -euo pipefail

strip_one() {
    local f="$1"
    [ -f "$f" ] || return 0

    if command -v jq >/dev/null 2>&1; then
        jq '
            .permissions.additionalDirectories = ((.permissions.additionalDirectories // []) | map(select(. != ".claude/hooks" and . != "./.claude/hooks")))
            | .hooks = ((.hooks // {}) | with_entries(
                .value = ((.value // []) | map(
                    if (.hooks | type == "array") then
                        .hooks = (.hooks | map(
                            if (.type == "command" and (.command | type == "string") and (.command | test("^\\.claude/hooks/[A-Za-z0-9_-]+\\.sh$"))) then
                                .command = ("bash scripts/run-claude-hook.sh " + (.command | split("/")[-1]))
                            else
                                .
                            end
                        ))
                    else
                        .
                    end
                ))
            ))
        ' "$f" > "$f.tmp"
        if cmp -s "$f" "$f.tmp"; then
            rm -f "$f.tmp"
            return 0
        fi
        mv "$f.tmp" "$f"
        echo "  ✓ Нормализованы hook settings — $f"
        return 0
    fi

    if command -v node >/dev/null 2>&1; then
        if _STRIP_CLAUDE_JSON="$f" node <<'NODE'
const fs = require("fs");
const p = process.env._STRIP_CLAUDE_JSON;
if (!p) process.exit(1);
const d = JSON.parse(fs.readFileSync(p, "utf8"));
if (!d.permissions) d.permissions = {};
const ad = Array.isArray(d.permissions.additionalDirectories) ? d.permissions.additionalDirectories : [];
const bad = new Set([".claude/hooks", "./.claude/hooks"]);
let changed = false;
const next = ad.filter((x) => !bad.has(x));
if (next.length !== ad.length) changed = true;
d.permissions.additionalDirectories = next;
if (d.hooks && typeof d.hooks === "object") {
  for (const eventName of Object.keys(d.hooks)) {
    const blocks = d.hooks[eventName];
    if (!Array.isArray(blocks)) continue;
    for (const block of blocks) {
      if (!block || !Array.isArray(block.hooks)) continue;
      for (const hook of block.hooks) {
        if (!hook || hook.type !== "command" || typeof hook.command !== "string") continue;
        const m = hook.command.match(/^\.claude\/hooks\/([A-Za-z0-9_-]+\.sh)$/);
        if (!m) continue;
        hook.command = `bash scripts/run-claude-hook.sh ${m[1]}`;
        changed = true;
      }
    }
  }
}
if (!changed) process.exit(0);
fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n", "utf8");
console.log("  ✓ Нормализованы hook settings — " + p);
NODE
        then
            return 0
        fi
    fi

    if command -v python3 >/dev/null 2>&1; then
        if ! python3 -c "import sys" >/dev/null 2>&1; then
            echo "  ○ normalize-hook-settings: python3 недоступен, пропуск $f" >&2
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
    ad = []
bad = {".claude/hooks", "./.claude/hooks"}
changed = False
next_ad = [x for x in ad if x not in bad]
if next_ad != ad:
    changed = True
perms["additionalDirectories"] = next_ad
d["permissions"] = perms
hooks = d.get("hooks") or {}
if isinstance(hooks, dict):
    for _, blocks in hooks.items():
        if not isinstance(blocks, list):
            continue
        for block in blocks:
            if not isinstance(block, dict):
                continue
            block_hooks = block.get("hooks")
            if not isinstance(block_hooks, list):
                continue
            for hook in block_hooks:
                if not isinstance(hook, dict) or hook.get("type") != "command":
                    continue
                cmd = hook.get("command")
                if not isinstance(cmd, str):
                    continue
                if cmd.startswith(".claude/hooks/") and cmd.endswith(".sh"):
                    hook["command"] = f"bash scripts/run-claude-hook.sh {cmd.split('/')[-1]}"
                    changed = True
if not changed:
    sys.exit(0)
with open(path, "w", encoding="utf-8") as fp:
    json.dump(d, fp, indent=2)
    fp.write("\n")
print(f"  ✓ Нормализованы hook settings — {path}")
PY
        return 0
    fi

    echo "  ○ normalize-hook-settings: нет jq, node и python3 — пропуск $f" >&2
}

for f in "$@"; do
    [ -n "$f" ] || continue
    strip_one "$f"
done
