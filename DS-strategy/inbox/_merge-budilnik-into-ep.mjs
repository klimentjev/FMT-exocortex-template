import fs from "fs";

const ep = "c:/Users/admin/IWE/DS-strategy/docs/school/EP.SCHOOL-RUBRIC-BUDILNIK.md";
const chunk = "c:/Users/admin/IWE/DS-strategy/inbox/_budilnik-entries.md";

let doc = fs.readFileSync(ep, "utf8");
let insert = fs.readFileSync(chunk, "utf8").trimEnd();

const startMark = "\n## 8. Хронология тем и заданий";
const endMark = "\n\n---\n\n## 9. Источники для углубления";
const s = doc.indexOf(startMark);
const e = doc.indexOf(endMark);
if (s !== -1 && e !== -1 && e > s) {
  doc = doc.slice(0, s) + "\n" + insert + doc.slice(e);
} else {
  const needle =
    "\n\nПри обновлении рубрики имеет смысл дополнять этот файл фактами из актуального чата и продуктовых описаний.";
  const i = doc.indexOf(needle);
  if (i === -1) throw new Error("needle not found");
  doc = doc.slice(0, i) + "\n\n" + insert + needle + doc.slice(i + needle.length);
}
fs.writeFileSync(ep, doc, "utf8");
console.log("merged, length", doc.length);
