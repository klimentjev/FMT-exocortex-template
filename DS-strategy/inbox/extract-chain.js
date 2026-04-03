const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

const sections = [
  'Цепочка от 26.02.26',
  'Цепочка от 06.02.26',
  'Научные результаты  22.01.26',
  'Научный аппарат диссертационного исследования 28.01.26',
];

sections.forEach(function(name) {
  var pos = content.indexOf(name);
  if (pos === -1) { console.log('\nNOT FOUND: ' + name); return; }
  var chunk = content.slice(pos, pos + 8000);
  var re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
  var m;
  var texts = [];
  while ((m = re.exec(chunk)) !== null) {
    var t = m[1].trim();
    if (t.length > 1) texts.push(t);
  }
  console.log('\n=== ' + name + ' ===');
  texts.forEach(function(t, i) { console.log((i+1) + '. ' + t); });
});
