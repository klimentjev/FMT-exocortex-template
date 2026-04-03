const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

// Search for the notation section
var keywords = ['Dfn', 'Dfd', 'цепочка научных', 'Цепочка научных', 'цепочка результатов', 'Цепочка результатов'];

keywords.forEach(function(kw) {
  var pos = content.indexOf(kw);
  if (pos === -1) { console.log('NOT FOUND: ' + kw); return; }
  // get surrounding context
  var start = Math.max(0, pos - 200);
  var end = Math.min(content.length, pos + 3000);
  var chunk = content.slice(start, end);
  // extract text nodes
  var re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
  var m;
  var texts = [];
  while ((m = re.exec(chunk)) !== null) {
    var t = m[1].trim();
    if (t.length > 0) texts.push(t);
  }
  console.log('\n=== Found: ' + kw + ' at pos ' + pos + ' ===');
  texts.slice(0, 30).forEach(function(t, i) { console.log((i+1) + '. ' + t); });
});
