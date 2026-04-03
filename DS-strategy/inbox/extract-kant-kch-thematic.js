/**
 * Тематический экстракт из Кант — Критика чистого разума (2020)
 * Извлекает ключевые пассажи по темам: определения, синтез, антиномии, диалектика
 */
const fs = require('fs');
const path = require('path');

const INBOX = __dirname;
const FULL_TEXT = path.join(INBOX, 'kant-kch-2020-full.txt');
const OUTPUT = path.join(INBOX, 'kant-kch-extract.txt');

const text = fs.readFileSync(FULL_TEXT, 'utf8');

// Разбиваем на страницы по маркерам "-- N of 567 --"
const rawPages = text.split(/\n-- \d+ of \d+ --\n/);
const pages = rawPages.map((chunk, idx) => ({
  num: idx + 1,
  text: chunk.replace(/\s+/g, ' ').trim(),
})).filter(p => p.text.length > 50);

console.log(`Всего страниц с контентом: ${pages.length}`);

// ── Тематические группы поиска ──────────────────────────────────────────────

const THEMES = [
  {
    name: 'Трансцендентальная эстетика — определения пространства и времени',
    terms: ['пространство есть', 'время есть', 'пространство не', 'время не',
            'трансцендентальная эстетика', 'метафизическое истолкование',
            'трансцендентальное истолкование'],
    contextChars: 600,
    maxPerTerm: 3,
  },
  {
    name: 'Дедукция категорий — единство апперцепции и синтез',
    terms: ['единство апперцепции', 'трансцендентальное единство',
            'синтетическое единство', 'дедукция чистых',
            'я мыслю', 'единство самосознания'],
    contextChars: 700,
    maxPerTerm: 3,
  },
  {
    name: 'Схематизм',
    terms: ['схематизм', 'схема чистого рассудочного', 'схема есть', 'трансцендентальная схема'],
    contextChars: 700,
    maxPerTerm: 4,
  },
  {
    name: 'Основоположения чистого рассудка',
    terms: ['аналогии опыта', 'основоположение', 'субстанция пребывает',
            'всякое изменение', 'все явления', 'причинности'],
    contextChars: 600,
    maxPerTerm: 2,
  },
  {
    name: 'Трансцендентальная диалектика — разум и идеи',
    terms: ['трансцендентальная иллюзия', 'идеи разума', 'идея есть',
            'разум ищет', 'безусловное', 'безусловной целостности',
            'принцип чистого разума'],
    contextChars: 700,
    maxPerTerm: 3,
  },
  {
    name: 'Антиномии чистого разума',
    terms: ['антиномия', 'тезис', 'антитезис', 'мир имеет начало',
            'простых частей', 'свобода есть', 'необходимое существо'],
    contextChars: 700,
    maxPerTerm: 3,
  },
  {
    name: 'Паралогизмы',
    terms: ['паралогизм', 'я мыслю есть', 'рациональная психология',
            'трансцендентальный субъект'],
    contextChars: 600,
    maxPerTerm: 3,
  },
  {
    name: 'Вещь в себе и явление',
    terms: ['вещь в себе', 'вещи в себе', 'явление есть', 'явления суть',
            'ноумен', 'феномен', 'трансцендентальный объект'],
    contextChars: 600,
    maxPerTerm: 3,
  },
  {
    name: 'Синтетические суждения a priori',
    terms: ['синтетические суждения a priori', 'синтетическое суждение',
            'аналитическое суждение', 'как возможны', 'расширяющие знание'],
    contextChars: 600,
    maxPerTerm: 3,
  },
  {
    name: 'Рассудок и разум — различение',
    terms: ['рассудок есть способность', 'разум есть способность',
            'рассудок создает', 'разум создает', 'рассудок в отличие',
            'в то время как рассудок', 'разум в отличие'],
    contextChars: 600,
    maxPerTerm: 3,
  },
];

// ── Вспомогательные функции ──────────────────────────────────────────────────

function findPassages(fullText, term, contextChars, maxResults) {
  const results = [];
  const lower = fullText.toLowerCase();
  const termLower = term.toLowerCase();
  let idx = 0;
  while (results.length < maxResults) {
    const pos = lower.indexOf(termLower, idx);
    if (pos === -1) break;
    // Расширяем до границ предложений
    let start = Math.max(0, pos - contextChars);
    let end = Math.min(fullText.length, pos + term.length + contextChars);
    // Ищем начало предложения (. или начало абзаца)
    const sentStart = fullText.lastIndexOf('. ', pos - 50);
    if (sentStart > start) start = sentStart + 2;
    // Ищем конец предложения
    const sentEnd = fullText.indexOf('. ', pos + term.length + 100);
    if (sentEnd !== -1 && sentEnd < end) end = sentEnd + 1;

    const snippet = fullText.slice(start, end).replace(/\s+/g, ' ').trim();
    if (snippet.length > 80) {
      results.push({ pos, snippet, term });
    }
    idx = pos + termLower.length;
  }
  return results;
}

function dedup(passages) {
  const seen = new Set();
  return passages.filter(p => {
    const key = p.snippet.slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Основной цикл ────────────────────────────────────────────────────────────

const lines = [];
lines.push('# Экстракт: Кант — Критика чистого разума (Философские технологии, 2020)');
lines.push('Источник: Immanuil_Kant_-_Kritika_chistogo_razuma_Filosofskie_tekhnologii_-_2020.pdf');
lines.push(`Страниц: 567 | Дата: ${new Date().toISOString().split('T')[0]}`);
lines.push('');
lines.push('Тематический экстракт ключевых пассажей. Каждый раздел — определения,');
lines.push('формулировки и аргументы по теме. Фрагменты отобраны по смысловой плотности.');
lines.push('');
lines.push('---');

let totalPassages = 0;

for (const theme of THEMES) {
  console.log(`\nТема: ${theme.name}`);
  const allPassages = [];

  for (const term of theme.terms) {
    const found = findPassages(text, term, theme.contextChars, theme.maxPerTerm);
    allPassages.push(...found);
    if (found.length) console.log(`  "${term}": ${found.length} пассажей`);
  }

  const unique = dedup(allPassages);
  // Сортируем по позиции (порядок в тексте)
  unique.sort((a, b) => a.pos - b.pos);

  console.log(`  → Итого уникальных: ${unique.length}`);
  totalPassages += unique.length;

  if (unique.length === 0) continue;

  lines.push('');
  lines.push(`## ${theme.name}`);
  lines.push('');

  unique.forEach((p, i) => {
    lines.push(`### [${i + 1}] (поз. ${p.pos}, термин: «${p.term}»)`);
    lines.push('');
    lines.push(p.snippet);
    lines.push('');
  });

  lines.push('---');
}

lines.push('');
lines.push(`*Всего пассажей в экстракте: ${totalPassages}*`);

fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
const sizeMB = (fs.statSync(OUTPUT).size / 1024).toFixed(1);
console.log(`\nЭкстракт сохранён: kant-kch-extract.txt (${sizeMB} КБ)`);
console.log(`Всего пассажей: ${totalPassages}`);
