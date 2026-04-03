const fs = require('fs');
const text = fs.readFileSync('lectures-an-full-text.txt', 'utf8');

const HEADER_PATTERNS = [
  /^Образовательный проект/,
  /^https:\/\/philosophiya/,
  /^Курс истории философии/,
  /^Автор Муравьев/,
];

// Split text by page markers: "-- N of 1423 --"
// chunk[0] = page 1 content, chunk[1] = page 2 content, etc.
const rawChunks = text.split(/\n-- \d+ of 1423 --\n/);
// rawChunks[0] = page 1, rawChunks[1] = page 2, ...

const pages = rawChunks.map((chunk, idx) => {
  const lines = chunk.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .filter(l => !HEADER_PATTERNS.some(p => p.test(l)));
  return { pageNum: idx + 1, lines };
});

// Find section structure: each "section" starts when the first content line 
// is a clearly identifiable title
const TOPIC_PATTERNS = [
  /^Предварительное понятие истории философии\.?$/i,
  /^Античная философия\.?$/i,
  /^Эллинистическая философия\.?$/i,
  /^Христианское философствование средних веков\.?$/i,
  /^Новоевропейская философия\.?$/i,
  /^(Философия|Метафизика|Логика)\s+(Нового|нового)/i,
];

const PART_PATTERNS = [
  /^Часть\s+\d+\.\s+/i,
  /^Лекция\s+\d+\.\s+/i,
];

const PHILOSOPHER_SECTIONS = [
  'Фалес', 'Анаксимандр', 'Анаксимен', 'Пифагор', 'Гераклит', 'Парменид', 
  'Зенон', 'Эмпедокл', 'Анаксагор', 'Атомисты', 'Демокрит', 
  'Сократ', 'Платон', 'Аристотель',
  'Стоики', 'Эпикур', 'Скептики', 'Неоплатоники', 'Плотин',
  'Августин', 'Ансельм', 'Абеляр', 'Фома Аквинский', 'Дунс Скот', 'Оккам',
  'Декарт', 'Спиноза', 'Лейбниц', 'Локк', 'Беркли', 'Юм',
  'Кант', 'Фихте', 'Шеллинг', 'Гегель',
];

// Build index
const index = [];
let currentTopic = '';
let currentPart = '';
let currentPhilosopher = '';
let philosopherPageStart = 0;
let topicPageStart = 0;

for (const { pageNum, lines } of pages) {
  if (lines.length === 0) continue;
  
  const firstLine = lines[0];
  const secondLine = lines[1] || '';
  
  // Check for main topic
  const isTopic = TOPIC_PATTERNS.some(p => p.test(firstLine));
  if (isTopic && firstLine !== currentTopic) {
    if (currentTopic) {
      index.push(`  Конец: с.${pageNum - 1}`);
    }
    currentTopic = firstLine;
    topicPageStart = pageNum;
    index.push('');
    index.push(`## ${firstLine} [с.${pageNum}+]`);
    currentPart = '';
    currentPhilosopher = '';
  }
  
  // Check for part/lecture subtitle
  const isPart = PART_PATTERNS.some(p => p.test(secondLine)) || 
                  PART_PATTERNS.some(p => p.test(firstLine));
  const partLine = PART_PATTERNS.some(p => p.test(firstLine)) ? firstLine : secondLine;
  if (isPart && partLine && partLine !== currentPart) {
    currentPart = partLine;
    index.push(`  [с.${pageNum}] ${partLine}`);
  }
  
  // Check for philosopher name as new section header
  // (appears when topic changes to a philosopher's lecture)  
  const allText = lines.join(' ');
  for (const ph of PHILOSOPHER_SECTIONS) {
    const re = new RegExp(`^(Иммануил\\s+)?${ph}(\\.)?$`);
    if (re.test(firstLine) && firstLine !== currentPhilosopher) {
      currentPhilosopher = firstLine;
      philosopherPageStart = pageNum;
      index.push('');
      index.push(`  ### ${firstLine} [с.${pageNum}+]`);
      break;
    }
  }
}

const indexText = [
  '# Индекс: Лекции АН ВСЕ — История философии (Муравьев А.Н.)',
  `Образовательный проект: ФИЛОСОФ&Я | https://philosophiya.ru/`,
  `Всего страниц: ${rawChunks.length}`,
  `Дата извлечения: ${new Date().toISOString().split('T')[0]}`,
  '',
  ...index,
].join('\n');

fs.writeFileSync('lectures-an-index.txt', indexText, 'utf8');
console.log(indexText);
console.log('\nIndex saved to lectures-an-index.txt');
