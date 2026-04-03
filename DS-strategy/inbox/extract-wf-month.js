const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

// Extract full tree with parent context for dissertation section
// Strategy: find date markers (месяц/год) and surrounding dissertation content

// First, let's look for date/month patterns in the last year
const datePatterns = [
  'февраль 2026', 'Февраль 2026',
  'январь 2026', 'Январь 2026',
  'декабрь 2025', 'Декабрь 2025',
  'ноябрь 2025', 'Ноябрь 2025',
  'март 2026', 'Март 2026',
  'февраль', 'январь', 'декабрь', 'ноябрь',
  '2026', '02.2026', '01.2026', '12.2025', '02.26', '01.26',
  'фев', 'янв', 'дек'
];

// Extract sections around date markers
const re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
let m;
let allItems = [];
let positions = [];

while ((m = re.exec(content)) !== null) {
  allItems.push({ text: m[1].trim(), pos: m.index });
}

// Find items with date markers
const dated = allItems.filter(item => 
  datePatterns.some(p => item.text.toLowerCase().includes(p.toLowerCase()))
);

console.log('=== DATE MARKERS FOUND ===');
dated.forEach((item, i) => {
  console.log(i+1, '|', item.text);
});

// Also find recent dissertation work - look for work-related verbs
console.log('\n=== DISSERTATION WORK (recent keywords) ===');
const workKeywords = [
  'написал', 'написал', 'работал', 'прочитал', 'изучил',
  'сформулировал', 'определил', 'придумал', 'набросок', 'тезисы',
  'план статьи', 'статья', 'Aufhebung', 'aufhebung', 
  'снятие как', 'три формы', 'нормативн',
  'сделал', 'нашел', 'нашёл', 'понял',
  'диссертац', 'глава', 'введение', 'параграф', 'научный результат'
];

const workItems = allItems.filter(item => 
  workKeywords.some(k => item.text.toLowerCase().includes(k.toLowerCase())) &&
  (item.text.toLowerCase().includes('диссерт') || 
   item.text.toLowerCase().includes('aufhebung') ||
   item.text.toLowerCase().includes('снятие') ||
   item.text.toLowerCase().includes('статья') ||
   item.text.toLowerCase().includes('гегель') ||
   item.text.toLowerCase().includes('логика'))
);

workItems.forEach((item, i) => {
  console.log(i+1, '|', item.text.substring(0, 300));
});

// Find the structure around Aufhebung
console.log('\n=== AUFHEBUNG SPECIFIC ===');
const aufhItems = allItems.filter(item => 
  item.text.toLowerCase().includes('aufhebung') ||
  (item.text.includes('снятие') && item.text.length > 50)
);
aufhItems.forEach((item, i) => {
  console.log(i+1, '|', item.text.substring(0, 400));
});
