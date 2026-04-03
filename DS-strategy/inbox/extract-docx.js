const fs = require('fs');
const path = require('path');

// DOCX is a ZIP file containing word/document.xml
// Let's extract the XML content manually
const filePath = 'C:/Users/admin/IWE/DS-strategy/inbox/Описание среды «ФИЛОСОФ&Я» В1-2.docx';

// Try using a simple approach: read as buffer and find XML text
const buf = fs.readFileSync(filePath);

// DOCX files contain word/document.xml inside a ZIP
// We can try to find readable text between XML tags
const str = buf.toString('latin1');

// Find the document.xml content - it starts after "word/document.xml"
const startMarker = 'word/document.xml';
const idx = str.indexOf(startMarker);
console.log('Found document.xml at:', idx);

// Try to find w:t tags (text runs in DOCX)
// These contain the actual text
const xmlStart = str.indexOf('<w:document', idx);
const xmlEnd = str.indexOf('</w:document>', xmlStart);
console.log('XML range:', xmlStart, '-', xmlEnd);

if (xmlStart > 0 && xmlEnd > xmlStart) {
  const xml = str.substring(xmlStart, xmlEnd + 15);
  // Extract text from w:t tags
  const textRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
  let match;
  const texts = [];
  while ((match = textRegex.exec(xml)) !== null) {
    texts.push(match[1]);
  }
  const result = texts.join(' ');
  fs.writeFileSync('C:/Users/admin/IWE/DS-strategy/inbox/docx-extract.txt', result, 'utf8');
  console.log('Extracted', texts.length, 'text runs, total chars:', result.length);
} else {
  console.log('Could not find XML boundaries, trying binary search...');
  // Try UTF-8 approach
  const strUtf = buf.toString('utf8');
  const xmlStartU = strUtf.indexOf('<w:document');
  const xmlEndU = strUtf.indexOf('</w:document>', xmlStartU);
  console.log('UTF8 XML range:', xmlStartU, '-', xmlEndU);
  if (xmlStartU > 0) {
    const xml = strUtf.substring(xmlStartU, xmlEndU + 15);
    const textRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
    let match;
    const texts = [];
    while ((match = textRegex.exec(xml)) !== null) {
      texts.push(match[1]);
    }
    const result = texts.join(' ');
    fs.writeFileSync('C:/Users/admin/IWE/DS-strategy/inbox/docx-extract.txt', result, 'utf8');
    console.log('UTF8: Extracted', texts.length, 'text runs');
  }
}
