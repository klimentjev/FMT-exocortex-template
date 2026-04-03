/**
 * Одноразовый конвертер: EP.SCHOOL-PROJECT-DESCRIPTION.md → .html
 * Запуск: node build-EP-SCHOOL-PROJECT-DESCRIPTION-html.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "EP.SCHOOL-PROJECT-DESCRIPTION.md");
const out = path.join(__dirname, "EP.SCHOOL-PROJECT-DESCRIPTION.html");

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s) {
  let t = esc(s);
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" rel="noopener">$1</a>');
  return t;
}

const raw = fs.readFileSync(src, "utf8");
const lines = raw.replace(/\r\n/g, "\n").split("\n");
const blocks = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  if (line.trim() === "---") {
    blocks.push({ type: "hr" });
    i++;
    continue;
  }

  if (line.startsWith("### ")) {
    blocks.push({ type: "h3", text: line.slice(4) });
    i++;
    continue;
  }

  if (line.startsWith("## ")) {
    blocks.push({ type: "h2", text: line.slice(3) });
    i++;
    continue;
  }

  if (line.startsWith("# ")) {
    blocks.push({ type: "h1", text: line.slice(2) });
    i++;
    continue;
  }

  if (line.startsWith("```")) {
    const lang = line.slice(3).trim();
    const code = [];
    i++;
    while (i < lines.length && !lines[i].startsWith("```")) {
      code.push(lines[i]);
      i++;
    }
    if (i < lines.length) i++;
    blocks.push({ type: "pre", lang, text: code.join("\n") });
    continue;
  }

  if (line.trim().startsWith("|") && line.includes("|")) {
    const tableLines = [];
    while (i < lines.length && lines[i].trim().startsWith("|")) {
      tableLines.push(lines[i]);
      i++;
    }
    const isSepRow = (row) => {
      const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
      return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
    };
    const rows = tableLines
      .filter((row) => !isSepRow(row))
      .map((row) =>
        row
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim())
      );
    blocks.push({ type: "table", rows });
    continue;
  }

  if (line.trim() === "") {
    i++;
    continue;
  }

  const para = [];
  while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && lines[i].trim() !== "---" && !lines[i].trim().startsWith("|")) {
    para.push(lines[i]);
    i++;
  }
  blocks.push({ type: "p", lines: para });
}

const css = `
:root {
  --bg: #faf9f7;
  --text: #1a1a1a;
  --muted: #5c5c5c;
  --border: #d8d4cc;
  --accent: #2c5282;
  --code-bg: #f0ebe3;
}
* { box-sizing: border-box; }
html { font-size: 17px; scroll-behavior: smooth; }
body {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
  margin: 0;
  padding: 1.5rem clamp(1rem, 4vw, 2.5rem) 3rem;
  max-width: 52rem;
  margin-left: auto;
  margin-right: auto;
}
h1 {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 0.75rem;
  color: var(--accent);
}
.doc-meta {
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
h2 {
  font-size: 1.25rem;
  margin: 2.25rem 0 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
  color: #111;
}
h2:first-of-type { border-top: none; padding-top: 0; }
h3 {
  font-size: 1.05rem;
  margin: 1.5rem 0 0.5rem;
  color: #333;
}
p { margin: 0 0 1rem; }
a { color: var(--accent); }
hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  margin: 1rem 0 1.5rem;
}
th, td {
  border: 1px solid var(--border);
  padding: 0.45rem 0.6rem;
  vertical-align: top;
  text-align: left;
}
th { background: #ebe6dc; font-weight: 600; }
tr:nth-child(even) td { background: rgba(0,0,0,0.02); }
pre {
  font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
  font-size: 0.78rem;
  line-height: 1.45;
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem 1.1rem;
  overflow-x: auto;
  margin: 1rem 0 1.5rem;
  white-space: pre;
}
.footnote {
  font-size: 0.88rem;
  color: var(--muted);
  margin: 1.25rem 0;
  padding-left: 0.75rem;
  border-left: 3px solid var(--border);
}
@media print {
  body { background: #fff; max-width: none; }
  a { color: #000; text-decoration: underline; }
  pre { white-space: pre-wrap; word-break: break-word; }
}
`;

let body = "";
for (const b of blocks) {
  if (b.type === "hr") body += "<hr>\n";
  else if (b.type === "h1") body += `<h1>${inline(b.text)}</h1>\n`;
  else if (b.type === "h2") body += `<h2>${inline(b.text)}</h2>\n`;
  else if (b.type === "h3") body += `<h3>${inline(b.text)}</h3>\n`;
  else if (b.type === "pre") body += `<pre><code>${esc(b.text)}</code></pre>\n`;
  else if (b.type === "table" && b.rows.length) {
    body += "<table>\n<thead>\n<tr>";
    const header = b.rows[0];
    for (const c of header) body += `<th>${inline(c)}</th>`;
    body += "</tr>\n</thead>\n<tbody>\n";
    for (let r = 1; r < b.rows.length; r++) {
      body += "<tr>";
      for (const c of b.rows[r]) body += `<td>${inline(c)}</td>`;
      body += "</tr>\n";
    }
    body += "</tbody>\n</table>\n";
  } else if (b.type === "p") {
    const text = b.lines.join(" ");
    // Одна строка *курсив* как в конце документа — не путать с **жирным**
    if (/^\*[^*].*\*$/s.test(text) && !text.includes("**")) {
      body += `<p class="footnote"><em>${inline(text.slice(1, -1))}</em></p>\n`;
    } else {
      body += `<p>${inline(text)}</p>\n`;
    }
  }
}

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(blocks.find((x) => x.type === "h1")?.text || "ФИЛОСОФ&Я")}</title>
  <style>${css}</style>
</head>
<body>
  <!-- Сборка из EP.SCHOOL-PROJECT-DESCRIPTION.md: node build-EP-SCHOOL-PROJECT-DESCRIPTION-html.mjs (каталог docs/school) -->
  <p class="doc-meta">Источник: <code>EP.SCHOOL-PROJECT-DESCRIPTION.md</code> · школа «ФИЛОСОФ&Я»</p>
${body}
</body>
</html>
`;

fs.writeFileSync(out, html, "utf8");
console.log("Written:", out);
