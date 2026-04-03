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

// Find context around key structural items
const targets = [
  'Задачи проекта ФИЛОСОФ',
  'Роль Администратора',
  'Кураторские инструкции',
  'правила, регламенты, инструкции',
  'Соратники-команда',
  'Чем занимается проект ФИЛОСОФ',
  'Расскажу подробнее о проекте ФИЛОСОФ',
  'среда развития',
  'ФИЛОСОФ&Я как среда',
  'что получите, работая',
  'Зарабатывайте от 50',
  'ФиЯ - школа мысли',
  'В современном мире',
];

// Extract 2000 chars around each target
let output = '';
targets.forEach(target => {
  const idx = content.indexOf(target);
  if (idx > 0) {
    const chunk = stripHtml(content.substring(Math.max(0, idx - 200), idx + 3000));
    output += '\n\n=== ' + target + ' ===\n' + chunk;
  } else {
    output += '\n\n=== ' + target + ' === NOT FOUND\n';
  }
});

fs.writeFileSync('C:/Users/admin/IWE/DS-strategy/inbox/school-details.txt', output, 'utf8');
console.log('Done');
