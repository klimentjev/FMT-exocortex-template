const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

// Get full context around the Dfn section (25 февраля entry)
var pos = content.indexOf('Dfn');
var start = Math.max(0, pos - 4000);
var end = Math.min(content.length, pos + 1000);
var chunk = content.slice(start, end);

var re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
var m;
var texts = [];
while ((m = re.exec(chunk)) !== null) {
  var t = m[1].trim();
  if (t.length > 0) texts.push(t);
}
texts.forEach(function(t, i) { console.log((i+1) + '. ' + t); });
