import fs from "fs";

const path = "c:/Users/admin/IWE/DS-strategy/inbox/WF - Export - 260305-151545.html";
const text = fs.readFileSync(path, "utf8");

function decode(s) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .trim();
}

const items = [];
for (const line of text.split("\n")) {
  if (!line.includes('data-parent="14f2eaadf111"')) continue;
  const m = line.match(/innerContentContainer">(.*?)<\/span>/);
  if (m) items.push(decode(m[1]));
}

const skip = new Set([
  "P.S.: ставьте 👍🔥❤️ и прочие, так я буду знать какие вопросы для вас важны или нет.",
]);

const boiler = (t) =>
  /^Напишите у себя в Дневнике/.test(t) ||
  /^Ссылки на дневники скидывайте/.test(t) ||
  /^Владимир Климентьев, \[\d/.test(t) ||
  /^Напишите ответ в теме для дискуссий/i.test(t) ||
  /^P\.S\.: если поставите реакции к этой записи/i.test(t) ||
  /^P\.S\.: если поставите реакции/i.test(t) ||
  /^Как хотите\.\s*$/.test(t);

const dayRe = /^(\d{1,2}\.\d{1,2}\.\d{2})\s+День\s+(\d+)\.?$/;

const entries = [];
let current = null;

for (const t of items) {
  if (skip.has(t)) continue;
  const dm = t.match(dayRe);
  if (dm) {
    if (current && (current.body.length || current.title)) entries.push(current);
    current = { date: dm[1], dayNum: dm[2], title: t, body: [] };
    continue;
  }
  if (!current) {
    if (t === "Будильник ФиЯ") continue;
    if (/^Владимир Климентьев, \[\d/.test(t)) continue;
    current = { date: "", dayNum: "", title: t, body: [] };
    continue;
  }
  if (boiler(t)) continue;
  current.body.push(t);
}

if (current && (current.body.length || current.title)) entries.push(current);

console.log("raw items", items.length, "grouped", entries.length);

function escMd(s) {
  return s.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}

const mdLines = [
  "",
  "## 8. Хронология тем и заданий (ветка «Будильник ФиЯ» в экспорте WF)",
  "",
  "Ниже — текст из `WF - Export - 260305-151545.html`, узлы с `data-parent` ветки «Будильник ФиЯ». Даты и нумерация дней — как в источнике. Убраны повторы: приглашения писать в дневник / в тему дискуссий, P.S. про реакции; остальное — как в экспорте.",
  "",
];

for (const e of entries) {
  if (!e.body.length) continue;
  const head =
    e.date && e.dayNum
      ? `### ${e.date} — День ${e.dayNum}`
      : e.title
        ? `### ${e.title}`
        : "### (без заголовка дня)";
  mdLines.push(head);
  for (const b of e.body) {
    const lines = escMd(b).split("\n").filter(Boolean);
    for (const ln of lines) mdLines.push(`- ${ln}`);
  }
  mdLines.push("");
}

const mdPath = "c:/Users/admin/IWE/DS-strategy/inbox/_budilnik-entries.md";
fs.writeFileSync(mdPath, mdLines.join("\n"), "utf8");
console.log("markdown lines", mdLines.length, "->", mdPath);
