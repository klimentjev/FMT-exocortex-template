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

// Parse the HTML structure to get parent-child relationships
// Find all li elements with their depth
// Strategy: find sections that contain "школа", "миссия", "команда", "инструкции"
// and extract the surrounding context (parent node + children)

// First, let's find the top-level sections related to school
// Look for nodes that contain key school-structural terms
const schoolStructureTerms = [
  'миссия',
  'команда',
  'инструкция',
  'цель',
  'задач',
  'продукт',
  'роль',
  'участник',
  'куратор',
  'ведущий',
  'преподаватель',
  'ученик',
  'слушатель',
  'программа',
  'курс',
  'формат',
  'расписание',
  'правила',
  'обязанности',
  'регламент',
  'структура'
];

const regex = /<span class="innerContentContainer">(.*?)<\/span>/g;
let match;
const allNodes = [];
while ((match = regex.exec(content)) !== null) {
  const text = stripHtml(match[1]).trim();
  if (text) allNodes.push({ text, pos: match.index });
}

console.log('Total nodes:', allNodes.length);

// Find nodes specifically about school structure (not just mentioning philosophy)
const schoolStructureNodes = allNodes.filter(n => {
  const lower = n.text.toLowerCase();
  const hasSchoolRef = lower.includes('школа') || lower.includes('философ&я') || lower.includes('школа мысли');
  const hasStructural = schoolStructureTerms.some(t => lower.includes(t));
  return hasStructural && (hasSchoolRef || lower.includes('инструкци') || lower.includes('команд'));
});

console.log('School structure nodes:', schoolStructureNodes.length);

// Also search for "ФИЛОСОФ&Я" specific nodes with context
const philSchoolNodes = allNodes.filter(n => {
  const text = n.text;
  return text.includes('ФИЛОСОФ&Я') || text.includes('школа мысли') || text.includes('Школа мысли');
});

console.log('ФИЛОСОФ&Я nodes:', philSchoolNodes.length);

// Write results
let output = '=== СТРУКТУРНЫЕ УЗЛЫ ШКОЛЫ ===\n\n';
schoolStructureNodes.forEach((n, i) => {
  output += (i + 1) + '. ' + n.text + '\n';
});

output += '\n\n=== УЗЛЫ С "ФИЛОСОФ&Я" / "ШКОЛА МЫСЛИ" ===\n\n';
philSchoolNodes.forEach((n, i) => {
  output += (i + 1) + '. ' + n.text + '\n';
});

fs.writeFileSync('C:/Users/admin/IWE/DS-strategy/inbox/school-structure.txt', output, 'utf8');
console.log('Saved to school-structure.txt');
