const fs = require('fs');
const path = require('path');

const md = fs.readFileSync(path.join(__dirname, 'dissertation-report-march2026.md'), 'utf8');

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMd(ln) {
  return ln
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

const lines = md.split(/\r?\n/);
const out = [];
let i = 0;
let inBlockquote = false;
let inList = false;
let inTable = false;
let tableRows = [];

function flushTable() {
  if (tableRows.length === 0) return;
  out.push('<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">');
  tableRows.forEach((row, idx) => {
    const tag = idx === 0 ? 'th' : 'td';
    const cells = row.map(c => `<${tag}>${inlineMd(c.trim())}</${tag}>`).join('');
    out.push('<tr>' + cells + '</tr>');
  });
  out.push('</table>');
  tableRows = [];
}

while (i < lines.length) {
  const line = lines[i];
  const trimmed = line.trim();

  if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
    if (inTable) {
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      const isSep = cells.every(c => /^:?-+:?$/.test(c) || c === '');
      if (!isSep && cells.some(Boolean)) tableRows.push(cells);
    } else {
      inTable = true;
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      tableRows.push(cells);
      i++;
      continue;
    }
    i++;
    continue;
  } else if (inTable) {
    flushTable();
    inTable = false;
  }

  if (trimmed.startsWith('>')) {
    const content = trimmed.length > 1 && trimmed[1] === ' ' ? trimmed.slice(2) : '';
    if (!inBlockquote) { inBlockquote = true; out.push('<blockquote style="margin:1em 0; padding-left:1em; border-left:4px solid #ccc;">'); }
    if (content) out.push('<p style="margin:0.3em 0;">' + inlineMd(content) + '</p>');
    i++;
    continue;
  } else if (inBlockquote) {
    inBlockquote = false;
    out.push('</blockquote>');
  }

  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    if (!inList) { inList = true; out.push('<ul style="margin:0.5em 0;">'); }
    out.push('<li>' + inlineMd(trimmed.slice(2)) + '</li>');
    i++;
    continue;
  } else if (inList) {
    inList = false;
    out.push('</ul>');
  }

  if (trimmed === '---') {
    out.push('<hr/>');
    i++;
    continue;
  }

  if (trimmed.startsWith('### ')) {
    out.push('<h3 style="margin:1em 0 0.5em;">' + inlineMd(trimmed.slice(4)) + '</h3>');
    i++;
    continue;
  }
  if (trimmed.startsWith('## ')) {
    out.push('<h2 style="margin:1.2em 0 0.5em;">' + inlineMd(trimmed.slice(3)) + '</h2>');
    i++;
    continue;
  }
  if (trimmed.startsWith('# ')) {
    out.push('<h1 style="margin:0 0 0.5em;">' + inlineMd(trimmed.slice(2)) + '</h1>');
    i++;
    continue;
  }

  if (trimmed === '') {
    out.push('<p style="margin:0.5em 0;"></p>');
    i++;
    continue;
  }

  out.push('<p style="margin:0.5em 0;">' + inlineMd(trimmed) + '</p>');
  i++;
}

if (inBlockquote) out.push('</blockquote>');
if (inList) out.push('</ul>');
if (inTable) flushTable();

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Отчёт о работе по диссертации</title>
  <style>
    body { font-family: 'Times New Roman', Georgia, serif; max-width: 800px; margin: 2em auto; padding: 0 1.5em; line-height: 1.5; color: #222; }
    table { font-size: 0.95em; }
    th { background: #f5f5f5; text-align: left; }
  </style>
</head>
<body>
${out.join('\n')}
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'dissertation-report-march2026.html'), html, 'utf8');
console.log('Created dissertation-report-march2026.html');
