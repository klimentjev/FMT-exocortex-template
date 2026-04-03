const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

const INBOX = __dirname;

const PDF_FILES = [
  { file: 'Гегель. Энциклопедия философских наук. В трех томах Т.1 Наука логики. М.Мысль, 1974.pdf', key: 'enciklopedia' },
  { file: 'Наука логики -1997.pdf', key: 'nauka-logiki' },
];

const SEARCH_TERMS = [
  'снятие', 'снят', 'aufhebung', 'снимает', 'снимается', 'снять',
  'разумн', 'рассудок', 'отрицание', 'сохранение', 'переход',
  'понятие', 'бытие', 'сущность',
];

function parsePdf(filePath) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);
    parser.on('pdfParser_dataReady', (pdfData) => {
      const text = parser.getRawTextContent();
      resolve(text);
    });
    parser.on('pdfParser_dataError', (err) => reject(err));
    parser.loadPDF(filePath);
  });
}

function countOccurrences(text, term) {
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  let count = 0;
  let idx = 0;
  while (true) {
    const pos = lower.indexOf(termLower, idx);
    if (pos === -1) break;
    count++;
    idx = pos + termLower.length;
  }
  return count;
}

function extractContext(text, term, contextChars = 400, maxResults = 50) {
  const results = [];
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  let idx = 0;
  while (results.length < maxResults) {
    const pos = lower.indexOf(termLower, idx);
    if (pos === -1) break;
    const start = Math.max(0, pos - contextChars);
    const end = Math.min(text.length, pos + term.length + contextChars);
    results.push({
      pos,
      snippet: text.slice(start, end).replace(/\s+/g, ' ').trim(),
    });
    idx = pos + termLower.length;
  }
  return results;
}

async function main() {
  for (const { file, key } of PDF_FILES) {
    const fpath = path.join(INBOX, file);
    if (!fs.existsSync(fpath)) {
      console.log(`Не найден: ${file}`);
      continue;
    }

    console.log(`\nПарсю: ${file}`);
    let text;
    try {
      text = await parsePdf(fpath);
      console.log(`  Символов извлечено: ${text.length}`);
    } catch (e) {
      console.error(`  Ошибка: ${e.message || e}`);
      continue;
    }

    // Сохранить полный текст
    const fullPath = path.join(INBOX, `hegel-${key}-full.txt`);
    fs.writeFileSync(fullPath, text, 'utf8');
    console.log(`  Полный текст → ${path.basename(fullPath)}`);

    // Статистика
    const statsLines = [`# Индекс: ${file}\n`];
    statsLines.push('## Статистика вхождений\n');
    for (const term of SEARCH_TERMS) {
      const count = countOccurrences(text, term);
      if (count > 0) statsLines.push(`  ${term}: ${count}`);
    }

    // Контексты снятия
    const KEY_TERMS = ['снятие', 'снят', 'aufhebung', 'aufheben', 'снимает', 'снимается'];
    statsLines.push('\n## Контексты\n');
    for (const term of KEY_TERMS) {
      const ctxs = extractContext(text, term, 400, 50);
      if (!ctxs.length) continue;
      statsLines.push(`\n### "${term}" (${ctxs.length} фрагментов)\n`);
      ctxs.forEach((c, i) => {
        statsLines.push(`[${i + 1}] ...${c.snippet}...`);
        statsLines.push('');
      });
    }

    const idxPath = path.join(INBOX, `hegel-${key}-index.txt`);
    fs.writeFileSync(idxPath, statsLines.join('\n'), 'utf8');
    console.log(`  Индекс → ${path.basename(idxPath)}`);
  }
  console.log('\nГотово.');
}

main().catch(console.error);
