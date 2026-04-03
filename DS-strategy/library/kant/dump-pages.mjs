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

const pages = process.argv.slice(2).map(Number);
const data = new Uint8Array(fs.readFileSync(PDF));
const doc = await getDocument({ data }).promise;

for (const p of pages) {
  if (p < 1 || p > doc.numPages) continue;
  const page = await doc.getPage(p);
  const tc = await page.getTextContent();
  const text = tc.items.map((x) => x.str).join(" ");
  console.log("\n\n========== PDF page " + p + " ==========\n");
  console.log(text);
}
