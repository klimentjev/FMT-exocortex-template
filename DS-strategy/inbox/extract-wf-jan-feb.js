const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

// Find sections by their markers and extract surrounding HTML with children
// Key sections to find:
const sectionMarkers = [
  'Научный аппарат диссертационного исследования 22.01.26',
  'Научный аппарат диссертационного исследования 28.01.26',
  'Цепочка от 06.02.26',
  'Цепочка от 26.02.26',
  'ЖЖ февраль 2026',
  'ЖЖ январь 2026',
  'ЖЖ март 2026',
  '22 января',
  '26 января',
  '28 января',
  '2 февраля',
  '12 февраля',
  '25 февраля',
];

// For each marker, find its position and extract ~3000 chars of HTML after it
// Then parse all span texts in that region

sectionMarkers.forEach(marker => {
  const pos = content.indexOf(marker);
  if (pos === -1) {
    console.log(`\n=== NOT FOUND: ${marker} ===`);
    return;
  }
  
  // Get surrounding context - 200 chars before, 4000 after
  const start = Math.max(0, pos - 200);
  const end = Math.min(content.length, pos + 5000);
  const chunk = content.slice(start, end);
  
  // Extract all texts in this chunk
  const re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
  let m;
  let texts = [];
  while ((m = re.exec(chunk)) !== null) {
    texts.push(m[1].trim());
  }
  
  console.log(`\n=== ${marker} ===`);
  texts.forEach((t, i) => {
    if (t.length > 1) console.log(`  ${i+1}. ${t}`);
  });
});
