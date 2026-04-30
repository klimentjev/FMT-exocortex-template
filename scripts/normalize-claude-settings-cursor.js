#!/usr/bin/env node
/**
 * Cursor/VS Code (Windows): running hooks as ".claude/hooks/*.sh" often opens editor tabs.
 * Rewrite to `bash scripts/run-claude-hook.sh <name>` (body from ~/.iwe/claude-hooks).
 * Strip `.claude/hooks` from permissions.additionalDirectories.
 */
const fs = require("fs");

const HOOK_CMD = /^(\.\/)?\.claude\/hooks\/([A-Za-z0-9_.-]+\.sh)$/;
const BAD_DIRS = new Set([".claude/hooks", "./.claude/hooks"]);

function rewriteCommand(cmd) {
  if (typeof cmd !== "string") return cmd;
  const t = cmd.trim();
  if (t.includes("run-claude-hook.sh")) return cmd;
  const m = t.match(HOOK_CMD);
  if (!m) return cmd;
  return `bash scripts/run-claude-hook.sh ${m[2]}`;
}

function normalizePermissions(d) {
  if (!d.permissions || typeof d.permissions !== "object") return;
  const ad = d.permissions.additionalDirectories;
  if (!Array.isArray(ad)) return;
  const next = ad.filter((x) => !BAD_DIRS.has(x));
  if (next.length !== ad.length) d.permissions.additionalDirectories = next;
}

function patchCommands(node) {
  if (!node || typeof node !== "object") return false;
  let changed = false;
  if (Array.isArray(node)) {
    for (const item of node) {
      if (patchCommands(item)) changed = true;
    }
    return changed;
  }
  for (const k of Object.keys(node)) {
    if (k === "command" && typeof node[k] === "string") {
      const n = rewriteCommand(node[k]);
      if (n !== node[k]) {
        node[k] = n;
        changed = true;
      }
    } else if (patchCommands(node[k])) changed = true;
  }
  return changed;
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return false;
  }
  let d;
  try {
    d = JSON.parse(raw);
  } catch (e) {
    console.error(`  ✗ JSON parse failed: ${filePath}: ${e.message}`);
    return false;
  }
  const minBefore = JSON.stringify(d);
  normalizePermissions(d);
  patchCommands(d.hooks);
  const minAfter = JSON.stringify(d);
  if (minBefore === minAfter) return false;
  fs.writeFileSync(filePath, `${JSON.stringify(d, null, 2)}\n`, "utf8");
  console.log(`  ✓ Cursor hook normalization — ${filePath}`);
  return true;
}

function main() {
  const paths = [...new Set(process.argv.slice(2).filter(Boolean))];
  if (paths.length === 0) {
    console.error("Usage: normalize-claude-settings-cursor.js <settings.json> [...]");
    process.exit(1);
  }
  let any = false;
  for (const p of paths) {
    if (processFile(p)) any = true;
  }
  if (!any && paths.some((p) => fs.existsSync(p))) {
    console.log("  ○ Cursor hook normalization — файлы уже в порядке");
  }
}

main();
