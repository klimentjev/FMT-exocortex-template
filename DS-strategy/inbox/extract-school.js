const fs = require('fs');
const content = fs.readFileSync('C:/Users/admin/IWE/DS-strategy/inbox/WF - Export - 260305-151545.html', 'utf8');

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

const regex = /<span class="innerContentContainer">(.*?)<\/span>/g;
let match;
const allNodes = [];
while ((match = regex.exec(content)) !== null) {
  const text = stripHtml(match[1]).trim();
  if (text) allNodes.push(text);
}

const schoolNodes = allNodes.filter(n => {
  const lower = n.toLowerCase();
  return lower.includes('философ') || 
         lower.includes('школа мысли') ||
         n.includes('миссия') || 
         n.includes('команда') || 
         n.includes('инструкции');
});

const output = 'Total nodes: ' + allNodes.length + '\nSchool nodes: ' + schoolNodes.length + '\n\n' +
  schoolNodes.map((n, i) => (i + 1) + '. ' + n).join('\n');

fs.writeFileSync('C:/Users/admin/IWE/DS-strategy/inbox/school-extract.txt', output, 'utf8');
console.log('Done. Total:', allNodes.length, 'School:', schoolNodes.length);
