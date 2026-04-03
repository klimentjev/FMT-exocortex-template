/**
 * Извлечение из docx «Финал Программа Международной научной конференции»
 * → conference-program.txt (полный текст)
 * → conference-program-index.txt (индекс: номер, ФИО, название доклада)
 */
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const INBOX = __dirname;
const DOCX_NAME = 'Финал Программа Международной научной конференции.docx';
const DOCX_PATH = path.join(INBOX, DOCX_NAME);
const OUTPUT_TXT = path.join(INBOX, 'conference-program.txt');
const OUTPUT_INDEX = path.join(INBOX, 'conference-program-index.txt');

// Короткие/служебные цитаты в блоке (не название доклада)
const SKIP_QUOTES = ['Диалектика и культура'];

function isReportTitle(quoted) {
  const s = quoted.trim();
  if (s.length < 18) return false;
  if (SKIP_QUOTES.some((skip) => s === skip)) return false;
  return true;
}

function buildIndex(text) {
  const lines = [];
  lines.push('# Индекс программы конференции');
  lines.push('# «Философия как логика: к 210-летию выхода в свет «Науки логики» Г.В.Ф.Гегеля»');
  lines.push(`# Обновлено: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');

  const rawLines = text.split(/\r?\n/);
  const entries = [];

  for (let i = 0; i < rawLines.length; i++) {
    const headMatch = rawLines[i].match(/^(\d{1,2})\.\s+(.+)$/);
    if (!headMatch) continue;
    const num = headMatch[1];
    const name = headMatch[2].trim();
    if (!/^[А-Яа-яёЁA-Za-z\s\-\.]+$/.test(name.slice(0, 60))) continue;

    // Блок: от следующей строки до следующего "M. Фамилия" (следующий доклад)
    const blockStart = i + 1;
    let blockEnd = rawLines.length;
    for (let k = blockStart; k < rawLines.length; k++) {
      if (k > i && /^\d{1,2}\.\s+[А-Яа-яёЁA-Za-z]/.test(rawLines[k])) {
        blockEnd = k;
        break;
      }
    }
    const block = rawLines.slice(blockStart, blockEnd).join('\n');

    // Название доклада — последняя полная цитата «...» в блоке (учитываем вложенные " ")
    let lastValid = '';
    let idx = 0;
    while (true) {
      const open = block.indexOf('«', idx);
      if (open === -1) break;
      const close = block.indexOf('»', open + 1);
      if (close === -1) break;
      const content = block.slice(open + 1, close).trim();
      if (isReportTitle(content)) lastValid = content;
      idx = close + 1;
    }
    // Если только кавычки " " (как у части докладов)
    if (!lastValid) {
      idx = 0;
      while (true) {
        const open = block.indexOf('"', idx);
        if (open === -1) break;
        const close = block.indexOf('"', open + 1);
        if (close === -1 || close === open + 1) break;
        const content = block.slice(open + 1, close).trim();
        if (isReportTitle(content)) lastValid = content;
        idx = close + 1;
      }
    }
    entries.push({ num, name: name.slice(0, 90), title: lastValid.slice(0, 250) });
  }

  for (const e of entries) {
    lines.push(`${e.num}. ${e.name}`);
    if (e.title) lines.push(`   «${e.title}»`);
    lines.push('');
  }

  lines.push(`Всего докладов в индексе: ${entries.length}`);
  return lines.join('\n');
}

async function main() {
  if (!fs.existsSync(DOCX_PATH)) {
    console.error('Файл не найден:', DOCX_PATH);
    process.exit(1);
  }

  console.log('Источник:', DOCX_NAME);
  const input = { path: DOCX_PATH };

  const result = await mammoth.extractRawText(input);
  const text = result.value;
  if (result.messages && result.messages.length) {
    result.messages.forEach((msg) => console.warn('mammoth:', msg.message));
  }

  fs.writeFileSync(OUTPUT_TXT, text, 'utf8');
  console.log('Экстракт →', path.basename(OUTPUT_TXT), `(${text.length} символов)`);

  const indexText = buildIndex(text);
  fs.writeFileSync(OUTPUT_INDEX, indexText, 'utf8');
  console.log('Индекс   →', path.basename(OUTPUT_INDEX));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
