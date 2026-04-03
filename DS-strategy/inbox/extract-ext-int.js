const fs = require('fs');
const buf = fs.readFileSync('WF - Export - 260305-151545.html');
const content = buf.toString('utf8');

var keywords = ['Ext', 'Int', 'экстенс', 'интенс', 'дефиниенс', 'Dfns', 'Dfn', 'genus', 'differentia'];

keywords.forEach(function(kw) {
  var pos = 0;
  var count = 0;
  while ((pos = content.indexOf(kw, pos)) !== -1 && count < 5) {
    var start = Math.max(0, pos - 100);
    var end = Math.min(content.length, pos + 500);
    var chunk = content.slice(start, end);
    var re = /<span class="innerContentContainer">([^<]+)<\/span>/g;
    var m;
    while ((m = re.exec(chunk)) !== null) {
      var t = m[1].trim();
      if (t.includes(kw) || t.toLowerCase().includes(kw.toLowerCase())) {
        console.log('[' + kw + '] ' + t);
        count++;
      }
    }
    pos++;
  }
});
