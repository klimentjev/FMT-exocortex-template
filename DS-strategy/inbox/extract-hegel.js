const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse').default || require('pdf-parse');

const INBOX = __dirname;
const OUTPUT = path.join(INBOX, 'hegel-index.txt');

const PDF_FILES = [
  'Гегель. Энциклопедия философских наук. В трех томах Т.1 Наука логики. М.Мысль, 1974.pdf',
  'Наука логики -1997.pdf',
];

const SEARCH_TERMS = [
  'снятие', 'снят', 'aufhebung', 'aufheben', 'aufgehoben',
  'aufhob', 'снимает', 'снимается', 'снимал', 'снять',
  'разумн', 'vernunft', 'рассудок', 'verstand',
  'отрицание', 'сохранение', 'переход', 'entwicklung',
  'понятие', 'бытие', 'сущность',
];

function extractContext(text, term, contextChars = 300) {
  const results = [];
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  let idx = 0;
  while (idx < lower.length) {
    const pos = lower.indexOf(termLower, idx);
    if (pos === -1) break;
    const start = Math.max(0, pos - contextChars);
    const end = Math.min(text.length, pos + term.length + contextChars);
    results.push({
      pos,
      snippet: text.slice(start, end).replace(/\s+/g, ' ').trim(),
    });
    idx = pos + termLower.length;
    if (results.length >= 500) break;
  }
  return results;
}

async function processPdf(filePath, label) {
  console.log(`\nОбрабатываю: ${label}`);
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer, { max: 0 });
  const text = data.text;
  console.log(`  Страниц: ${data.numpages}, символов: ${text.length}`);
  return { label, text, pages: data.numpages };
}

async function main() {
  const lines = [];
  lines.push('# Индекс Гегель — Наука логики');
  lines.push(`Создан: ${new Date().toISOString()}`);
  lines.push('');

  for (const fname of PDF_FILES) {
    const fpath = path.join(INBOX, fname);
    if (!fs.existsSync(fpath)) {
      console.log(`Файл не найден: ${fname}`);
      continue;
    }

    let data;
    try {
      data = await processPdf(fpath, fname);
    } catch (e) {
      console.error(`Ошибка при парсинге ${fname}: ${e.message}`);
      continue;
    }

    lines.push(`\n${'='.repeat(80)}`);
    lines.push(`ИСТОЧНИК: ${data.label}`);
    lines.push(`Страниц: ${data.pages}`);
    lines.push('='.repeat(80));

    // Общая статистика вхождений
    lines.push('\n## Статистика вхождений\n');
    for (const term of SEARCH_TERMS) {
      const lower = data.text.toLowerCase();
      const termLower = term.toLowerCase();
      let count = 0;
      let idx = 0;
      while (true) {
        const pos = lower.indexOf(termLower, idx);
        if (pos === -1) break;
        count++;
        idx = pos + termLower.length;
      }
      if (count > 0) {
        lines.push(`  ${term}: ${count} вхождений`);
      }
    }

    // Контексты для ключевых терминов
    const KEY_TERMS = ['снятие', 'снят', 'aufhebung', 'aufheben', 'снимает', 'снимается'];
    lines.push('\n## Контексты ключевых терминов\n');
    for (const term of KEY_TERMS) {
      const contexts = extractContext(data.text, term, 400);
      if (contexts.length === 0) continue;
      lines.push(`\n### "${term}" (${contexts.length} вхождений)\n`);
      const sample = contexts.slice(0, 30);
      sample.forEach((c, i) => {
        lines.push(`[${i + 1}] поз.${c.pos}:`);
        lines.push(c.snippet);
        lines.push('');
      });
      if (contexts.length > 30) {
        lines.push(`... (ещё ${contexts.length - 30} вхождений)`);
      }
    }

    // Полный текст (для поиска)
    const FULL_OUTPUT = path.join(INBOX, `hegel-full-${PDF_FILES.indexOf(fname)}.txt`);
    fs.writeFileSync(FULL_OUTPUT, data.text, 'utf8');
    console.log(`  Полный текст сохранён: ${path.basename(FULL_OUTPUT)}`);
  }

  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`\nИндекс сохранён: ${OUTPUT}`);
}

main().catch(console.error);
