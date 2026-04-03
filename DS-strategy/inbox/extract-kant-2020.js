const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const INBOX = __dirname;
const PDF_FILE = 'Immanuil_Kant_-_Kritika_chistogo_razuma_Filosofskie_tekhnologii_-_2020.pdf';
const KEY = 'kant-kch-2020';

const SEARCH_TERMS = [
  'трансцендентальный', 'трансцендентальная', 'трансцендентальное', 'трансцендентальной',
  'категория', 'категории', 'категорий',
  'рассудок', 'рассудка', 'рассудку', 'рассудком',
  'разум', 'разума', 'разуму',
  'созерцание', 'созерцания', 'созерцанию',
  'явление', 'явлений', 'явлениях',
  'вещь в себе', 'вещи в себе',
  'апперцепция', 'апперцепции',
  'антиномия', 'антиномии', 'антиномий',
  'схема', 'схематизм', 'схемы',
  'априори', 'a priori', 'апостериори',
  'синтетический', 'аналитический', 'синтетическое', 'аналитическое',
  'чувственность', 'пространство', 'время',
  'понятие', 'понятия', 'понятий',
  'суждение', 'суждения', 'суждений',
  'познание', 'познания',
  'единство', 'синтез',
  'дедукция', 'схематизм',
  'паралогизм', 'антиномия',
  'идеал', 'идея', 'идеи',
  'опыт', 'опыта',
];

const KEY_TERMS = [
  'трансцендентальный', 'трансцендентальная',
  'категория', 'рассудок', 'разум',
  'созерцание', 'явление',
  'вещь в себе', 'апперцепция',
  'антиномия', 'схематизм', 'дедукция',
];

function countOccurrences(text, term) {
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  let count = 0, idx = 0;
  while (true) {
    const pos = lower.indexOf(termLower, idx);
    if (pos === -1) break;
    count++;
    idx = pos + termLower.length;
  }
  return count;
}

function extractContext(text, term, contextChars = 400, maxResults = 25) {
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
  const fpath = path.join(INBOX, PDF_FILE);
  if (!fs.existsSync(fpath)) {
    console.error(`Файл не найден: ${PDF_FILE}`);
    process.exit(1);
  }

  console.log(`Парсю: ${PDF_FILE}`);
  const buf = fs.readFileSync(fpath);
  let text, numpages, pages;
  try {
    const parser = new PDFParse({ verbosity: 0, data: new Uint8Array(buf) });
    await parser.load();
    const result = await parser.getText();
    text = result.text;
    numpages = result.total;
    pages = result.pages;
  } catch (e) {
    console.error(`Ошибка парсинга: ${e.message}`);
    process.exit(1);
  }

  console.log(`  Страниц: ${numpages}, символов: ${text.length}`);
  console.log(`  Пример (первые 300 символов):`);
  console.log('  ' + text.slice(0, 300).replace(/\s+/g, ' '));

  // Полный текст
  const fullPath = path.join(INBOX, `${KEY}-full.txt`);
  fs.writeFileSync(fullPath, text, 'utf8');
  console.log(`\n  Полный текст → ${path.basename(fullPath)}`);

  // Индекс
  const lines = [];
  lines.push(`# Индекс: Кант — Критика чистого разума (Философские технологии, 2020)`);
  lines.push(`Файл: ${PDF_FILE}`);
  lines.push(`Страниц: ${numpages} | Символов: ${text.length}`);
  lines.push(`Дата извлечения: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  // Постраничный индекс
  lines.push('## Структура (разделы по страницам)\n');
  const SECTION_PATTERNS = [
    /^(Предисловие|Введение|Заключение|Приложение|Примечания|Оглавление)\b/i,
    /^(Часть|Глава|Раздел|Книга|Отдел)\s+(первая|вторая|третья|первый|второй|третий|\d+)/i,
    /^(Трансцендентальная|Трансцендентальный|Трансцендентальное)\s+\w/i,
    /^(Аналитика|Диалектика|Эстетика|Дедукция|Схематизм|Антиномия|Паралогизм|Идеал)/i,
    /^(Критика чистого разума)/i,
    /^[IVX]+\.\s+/,
  ];
  if (pages) {
    for (let i = 0; i < pages.length; i++) {
      const pageNum = i + 1;
      const pageText = typeof pages[i] === 'string' ? pages[i] : (pages[i].text || '');
      const pageLines = pageText.split('\n').map(l => l.trim()).filter(Boolean);
      if (pageLines.length === 0) continue;
      const first = pageLines[0];
      if (SECTION_PATTERNS.some(p => p.test(first))) {
        lines.push(`  [с.${pageNum}] ${first}`);
      }
    }
  }
  lines.push('');

  // Статистика
  lines.push('## Статистика вхождений\n');
  for (const term of SEARCH_TERMS) {
    const count = countOccurrences(text, term);
    if (count > 0) lines.push(`  ${term}: ${count}`);
  }

  // Контексты
  lines.push('\n## Контексты ключевых терминов\n');
  for (const term of KEY_TERMS) {
    const ctxs = extractContext(text, term, 400, 25);
    if (!ctxs.length) continue;
    lines.push(`\n### "${term}" (${ctxs.length} фрагментов)\n`);
    ctxs.forEach((c, i) => {
      lines.push(`[${i + 1}] поз.${c.pos}:`);
      lines.push(c.snippet);
      lines.push('');
    });
    if (ctxs.length === 25) lines.push(`... (показано 25 из всех вхождений)`);
  }

  const idxPath = path.join(INBOX, `${KEY}-index.txt`);
  fs.writeFileSync(idxPath, lines.join('\n'), 'utf8');
  console.log(`  Индекс → ${path.basename(idxPath)}`);
  console.log('\nГотово.');
}

main().catch(console.error);
