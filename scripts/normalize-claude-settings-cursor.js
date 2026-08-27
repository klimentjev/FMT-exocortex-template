#!/usr/bin/env node
/**
 * Cursor/VS Code (Windows): hook commands ".claude/hooks/*.sh" открывают вкладки.
 * 1) Патчит settings.json (additionalDirectories + команды).
 * 2) Записывает .claude/settings.local.json с ключом "hooks" — merge в Claude Code
 *    перекрывает upstream; файл не затирается update-manifest (обычно не в списке).
 * 3) Существующий settings.local.json (permissions, mcpServers) сохраняется, добавляется hooks.
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

function settingsLocalPath(settingsPath) {
  return settingsPath.replace(/settings\.json$/i, "settings.local.json");
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
  if (d.hooks && typeof d.hooks === "object") {
    patchCommands(d.hooks);
  }
  const minAfter = JSON.stringify(d);

  if (minBefore !== minAfter) {
    fs.writeFileSync(filePath, `${JSON.stringify(d, null, 2)}\n`, "utf8");
    console.log(`  ✓ Cursor hook normalization — ${filePath}`);
  }

  const localPath = settingsLocalPath(filePath);
  let local = {};
  if (fs.existsSync(localPath)) {
    try {
      local = JSON.parse(fs.readFileSync(localPath, "utf8"));
    } catch (e) {
      console.error(`  ⚠ settings.local.json parse failed (${localPath}): ${e.message} — hooks-only merge`);
    }
  }

  const merged = { ...local };
  if (d.hooks && typeof d.hooks === "object") {
    merged.hooks = d.hooks;
  }

  const localOut = `${JSON.stringify(merged, null, 2)}\n`;
  const localPrev = fs.existsSync(localPath) ? fs.readFileSync(localPath, "utf8") : "";
  let changed = minBefore !== minAfter;
  if (localOut.replace(/\r\n/g, "\n") !== localPrev.replace(/\r\n/g, "\n")) {
    fs.writeFileSync(localPath, localOut, "utf8");
    console.log(`  ✓ hooks overlay (settings.local.json) — ${localPath}`);
    changed = true;
  }

  return changed;
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
    console.log("  ○ Cursor hook normalization — уже применено (и settings.local.json синхронен)");
  }
}

main();
