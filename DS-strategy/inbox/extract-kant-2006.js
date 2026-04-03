const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const INBOX = __dirname;
const PDF_FILE = 'Kant_I_-_Sochinenia_na_nemetskom_i_russkom_yazykakh_V_4_t_Tom_2_Ch_1_-2006.pdf';
const KEY = 'kant-2006-tom2-ch1';

// Термины для двуязычного издания (рус + нем)
const SEARCH_TERMS = [
  // Русские
  'трансцендентальный', 'трансцендентальная', 'трансцендентальное',
  'категория', 'категории',
  'рассудок', 'разум', 'созерцание',
  'явление', 'вещь в себе',
  'апперцепция', 'антиномия', 'схематизм',
  'априори', 'a priori',
  'синтетический', 'аналитический',
  'чувственность', 'пространство', 'время',
  'понятие', 'суждение', 'познание', 'единство', 'синтез',
  // Немецкие
  'transzendental', 'Kategorie', 'Verstand', 'Vernunft',
  'Anschauung', 'Erscheinung', 'Ding an sich',
  'Apperzeption', 'Antinomie', 'Schematismus',
  'synthetisch', 'analytisch', 'Sinnlichkeit',
  'Raum', 'Zeit', 'Begriff', 'Urteil', 'Erkenntnis',
  'Einheit', 'Synthesis',
];

const KEY_TERMS_RU = [
  'трансцендентальный', 'трансцендентальная',
  'рассудок', 'разум', 'вещь в себе',
  'апперцепция', 'антиномия',
];

const KEY_TERMS_DE = [
  'transzendental', 'Verstand', 'Vernunft',
  'Ding an sich', 'Apperzeption', 'Antinomie',
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

function extractContext(text, term, contextChars = 350, maxResults = 20) {
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

  // Проверяем качество: смотрим первые 200 символов
  const sample = text.slice(0, 200).replace(/\s+/g, ' ');
  console.log(`  Пример текста: ${sample}`);

  // Сохранить полный текст
  const fullPath = path.join(INBOX, `${KEY}-full.txt`);
  fs.writeFileSync(fullPath, text, 'utf8');
  console.log(`  Полный текст → ${path.basename(fullPath)}`);

  // Индекс
  const lines = [];
  lines.push(`# Индекс: Кант — Сочинения (нем./рус.) Т.2 Ч.1 (2006)`);
  lines.push(`Файл: ${PDF_FILE}`);
  lines.push(`Страниц: ${numpages} | Символов: ${text.length}`);
  lines.push(`Дата извлечения: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  // Постраничный индекс разделов
  lines.push('## Структура (разделы по страницам)\n');
  const SECTION_PATTERNS = [
    /^(Предисловие|Введение|Заключение|Приложение|Примечания)\b/i,
    /^(Часть|Глава|Раздел|Книга|Отдел)\s+(первая|вторая|третья|первый|второй|третий|\d+)/i,
    /^(Трансцендентальная|Трансцендентальный|Трансцендентальное)\s+\w/i,
    /^(Аналитика|Диалектика|Эстетика|Дедукция|Схематизм|Антиномия|Паралогизм)/i,
    /^(Vorrede|Einleitung|Einleitung zur|Beschluss|Anhang)\b/i,
    /^(Transzendentalе|Transzendentale|Analytik|Dialektik|Ästhetik|Deduktion)/i,
    /^(Erstes|Zweites|Drittes|Viertes)\s+(Buch|Hauptstück|Kapitel)/i,
    /^(Kritik der reinen Vernunft)/i,
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

  // Статистика вхождений
  lines.push('## Статистика вхождений\n');
  lines.push('### Русские термины\n');
  for (const term of SEARCH_TERMS.slice(0, 24)) {
    const count = countOccurrences(text, term);
    if (count > 0) lines.push(`  ${term}: ${count}`);
  }
  lines.push('\n### Немецкие термины\n');
  for (const term of SEARCH_TERMS.slice(24)) {
    const count = countOccurrences(text, term);
    if (count > 0) lines.push(`  ${term}: ${count}`);
  }

  // Контексты
  lines.push('\n## Контексты: русские ключевые термины\n');
  for (const term of KEY_TERMS_RU) {
    const ctxs = extractContext(text, term, 350, 20);
    if (!ctxs.length) continue;
    lines.push(`\n### "${term}" (${ctxs.length} фрагментов)\n`);
    ctxs.forEach((c, i) => {
      lines.push(`[${i + 1}] поз.${c.pos}:`);
      lines.push(c.snippet);
      lines.push('');
    });
    if (ctxs.length === 20) lines.push(`... (показано 20 из всех вхождений)`);
  }

  lines.push('\n## Контексты: немецкие ключевые термины\n');
  for (const term of KEY_TERMS_DE) {
    const ctxs = extractContext(text, term, 350, 20);
    if (!ctxs.length) continue;
    lines.push(`\n### "${term}" (${ctxs.length} фрагментов)\n`);
    ctxs.forEach((c, i) => {
      lines.push(`[${i + 1}] поз.${c.pos}:`);
      lines.push(c.snippet);
      lines.push('');
    });
    if (ctxs.length === 20) lines.push(`... (показано 20 из всех вхождений)`);
  }

  const idxPath = path.join(INBOX, `${KEY}-index.txt`);
  fs.writeFileSync(idxPath, lines.join('\n'), 'utf8');
  console.log(`  Индекс → ${path.basename(idxPath)}`);
  console.log('\nГотово.');
}

main().catch(console.error);
