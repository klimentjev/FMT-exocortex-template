const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

// Get full content of key sections with larger context
const sections = [
  { name: 'Цепочка от 26.02.26', size: 8000 },
  { name: 'Научный аппарат диссертационного исследования 28.01.26', size: 8000 },
  { name: 'Научный аппарат диссертационного исследования 22.01.26', size: 6000 },
  { name: 'Доклад для конференции по НЛ Гегеля до февраля', size: 5000 },
];

sections.forEach(({ name, size }) => {
  const pos = content.indexOf(name);
  if (pos === -1) {
    console.log(`\n=== NOT FOUND: ${name} ===`);
    return;
  }
  
  const start = Math.max(0, pos - 100);
  const end = Math.min(content.length, pos + size);
  const chunk = content.slice(start, end);
  
  const re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
  let m;
  let texts = [];
  while ((m = re.exec(chunk)) !== null) {
    texts.push(m[1].trim());
  }
  
  console.log(`\n=== ${name} ===`);
  texts.forEach((t, i) => {
    if (t.length > 1) console.log(`  ${i+1}. ${t}`);
  });
});
