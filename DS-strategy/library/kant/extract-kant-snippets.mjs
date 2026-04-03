import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

const PDF = "Immanuil_Kant_-_Kritika_chistogo_razuma_Filosofskie_tekhnologii_-_2020.pdf";
const __dirname = dirname(fileURLToPath(import.meta.url));
GlobalWorkerOptions.workerSrc = pathToFileURL(
  join(__dirname, "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")
).href;

const data = new Uint8Array(fs.readFileSync(PDF));
const doc = await getDocument({ data }).promise;
const needles = [
  "пусты",
  "слепы",
  "Трансцендентальная логика",
  "трансцендентальное знание",
  "истина",
  "согласие познания",
  "общая логика",
  "формальная логика",
];

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const tc = await page.getTextContent();
  const text = tc.items.map((x) => x.str).join(" ");
  const hits = needles.filter((n) => text.includes(n));
  if (hits.length) console.log("--- page", p, "hits:", hits.join(", "));
}
