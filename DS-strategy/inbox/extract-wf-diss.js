const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

// Extract all text items with their parent context
// We need to find items related to dissertation
const re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
let m;
let allItems = [];
while ((m = re.exec(content)) !== null) {
  allItems.push(m[1].trim());
}

console.log('Total items:', allItems.length);

// Search for dissertation keywords
const keywords = [
  'диссерт', 'Aufhebung', 'aufhebung', 'снятие', 'Снятие', 
  'гегель', 'Гегель', 'логика', 'Логика', 'статья', 'доклад', 
  'апрель', 'философ', 'тезис', 'диплом', 'наука логики',
  'написать', 'НЛ', 'нормативн', 'реконструкц'
];

const relevant = allItems.filter(t => 
  keywords.some(k => t.toLowerCase().includes(k.toLowerCase()))
);

console.log('Relevant items:', relevant.length);
console.log('---');
relevant.forEach((t, i) => {
  process.stdout.write((i+1) + ' | ' + t + '\n');
});
