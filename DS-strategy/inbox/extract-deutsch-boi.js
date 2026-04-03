/**
 * Извлечение текста + тематический индекс: Дойч — Начало бесконечности (PDF в library/deutsch).
 * Запуск: node extract-deutsch-boi.js
 */
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const PDF = path.join(__dirname, '..', 'library', 'deutsch', 'Devid_Doych_-_Nachalo_beskonechnosti_Obyasnenia_kotorye_menyayut_mir.pdf');
const OUT_FULL = path.join(__dirname, '..', 'library', 'deutsch', 'deutsch-boi-full.txt');
const OUT_INDEX = path.join(__dirname, '..', 'library', 'deutsch', 'deutsch-boi-index.txt');

const SEARCH_TERMS = [
  'объяснен', 'знани', 'проблем', 'эволюц', 'мультивселенн', 'Поппер', 'критическ',
  'рационализм', 'теори', 'бесконечност', 'творчест', 'ошибк', 'истин', 'прогресс',
  'критер', 'создан', 'физик', 'квант', 'университет', 'культур', 'мультивселенн',
];

function extractContext(text, term, contextChars = 280) {
  const results = [];
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  let idx = 0;
  while (idx < lower.length) {
    const pos = lower.indexOf(termLower, idx);
    if (pos === -1) break;
    const start = Math.max(0, pos - contextChars);
    const end = Math.min(text.length, pos + term.length + contextChars);
    results.push({ pos, snippet: text.slice(start, end).replace(/\s+/g, ' ').trim() });
    idx = pos + termLower.length;
    if (results.length >= 40) break;
  }
  return results;
}

async function main() {
  const dataBuffer = fs.readFileSync(PDF);
  const parser = new PDFParse({ verbosity: 0, data: new Uint8Array(dataBuffer) });
  await parser.load();
  const result = await parser.getText();
  const text = result.text;
  const numpages = result.total;
  fs.writeFileSync(OUT_FULL, `# Дойч Д. — Начало бесконечности (extract)\n# Страниц: ${numpages}\n# ${new Date().toISOString()}\n\n${text}`, 'utf8');

  const lines = [];
  lines.push('# Индекс: Дойч Д. Начало бесконечности (рус. пер.)');
  lines.push(`Страниц (PDF): ${numpages}; символов текста: ${text.length}`);
  lines.push(`Создан: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Статистика вхождений (подстроки)');
  lines.push('');
  const lower = text.toLowerCase();
  for (const term of [...new Set(SEARCH_TERMS)]) {
    let c = 0;
    let i = 0;
    const tl = term.toLowerCase();
    while ((i = lower.indexOf(tl, i)) !== -1) {
      c++;
      i += tl.length;
    }
    if (c > 0) lines.push(`  ${term}: ${c}`);
  }
  lines.push('');
  lines.push('## Контексты (фрагменты)');
  for (const term of ['объяснен', 'критический рационализм', 'Поппер', 'мультивселенн', 'проблем', 'бесконечност']) {
    const found = extractContext(text, term.split(' ')[0], 320);
    if (found.length === 0) continue;
    lines.push('');
    lines.push(`### "${term}" (до ${found.length} фрагментов)`);
    found.slice(0, 12).forEach((f, n) => lines.push(`\n[${n + 1}] ${f.snippet}`));
  }
  fs.writeFileSync(OUT_INDEX, lines.join('\n'), 'utf8');
  console.log('OK:', OUT_FULL, OUT_INDEX);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
