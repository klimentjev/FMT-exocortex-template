const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
  console.error('Loading PDF...');
  const buf = fs.readFileSync('Лекции АН ВСЕ История философии.pdf');
  const parser = new PDFParse({ verbosity: 0, data: new Uint8Array(buf) });
  await parser.load();
  console.error('PDF loaded. Extracting text...');
  
  const result = await parser.getText();
  const fullText = result.text;
  const pages = result.pages; // array of page objects
  const numPages = result.total;
  
  console.error(`Extracted: ${numPages} pages, ${fullText.length} chars`);
  
  // Save full text
  fs.writeFileSync('lectures-an-full-text.txt', fullText, 'utf8');
  console.error('Full text saved.');
  
  // Build index: find section titles per page
  const indexLines = [`# Индекс: Лекции АН ВСЕ — История философии`, 
    `Автор: Муравьев А.Н. | Проект: ФИЛОСОФ&Я`, 
    `Всего страниц: ${numPages}`, ''];
  
  const SKIP = ['philosophiya.ru', 'Образовательный проект', 
    'Курс истории философии', 'Автор Муравьев'];
  
  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    const pageText = typeof pages[i] === 'string' ? pages[i] : (pages[i].text || '');
    const lines = pageText.split('\n').map(l => l.trim()).filter(Boolean);
    const content = lines.filter(l => !SKIP.some(s => l.includes(s)));
    
    if (content.length === 0) continue;
    const first = content[0];
    
    // Section title patterns
    if (first.match(/^Предварительное понятие/i) ||
        first.match(/^(Часть|Лекция|Глава)\s+\d+/i) ||
        first.match(/^(Введение|Заключение|Приложение)\b/i) ||
        first.match(/^[А-ЯЁ][а-яё]+\s+(философ|греч|элеат|пифагор|сократ|платон|аристот|стоик|эпикур|скепт|неоплатон|средневек|новоевроп|кант|фихте|шеллинг|гегель|феноменолог)/i)) {
      indexLines.push(`[с.${pageNum}] ${first}`);
    }
  }
  
  const indexText = indexLines.join('\n');
  fs.writeFileSync('lectures-an-index.txt', indexText, 'utf8');
  
  console.log(indexText);
  console.error(`\nIndex: ${indexLines.length - 4} entries`);
}

main().catch(console.error);
