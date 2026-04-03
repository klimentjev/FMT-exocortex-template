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
  if (text) allNodes.push({ text, pos: match.index });
}

const sniatieNodes = allNodes.filter(n => {
  const lower = n.text.toLowerCase();
  return lower.includes('снятие') || lower.includes('снимает') || lower.includes('снять') ||
         lower.includes('aufhebung') || lower.includes('снимается') || lower.includes('снимая') ||
         lower.includes('снято') || lower.includes('снятого');
});

console.log('Nodes about снятие:', sniatieNodes.length);
const output = sniatieNodes.map((n, i) => (i + 1) + '. ' + n.text).join('\n\n');
fs.writeFileSync('C:/Users/admin/IWE/DS-strategy/inbox/sniatie-extract.txt', output, 'utf8');
console.log('Saved.');
