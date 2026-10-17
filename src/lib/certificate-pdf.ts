import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, setCharacterSpacing, type PDFFont, type PDFPage, type RGB } from "pdf-lib";

// Certificatul ca fișier PDF (A4 orizontal), cu același aspect ca pagina /certificate/[cod].
// Fonturile site-ului (licență OFL) sunt incluse în proiect: au diacriticele românești,
// pe care fonturile standard din PDF nu le au.

const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");

const W = 841.89; // A4 orizontal, în puncte
const H = 595.28;
const u = W / 100; // 1% din lățime, ca unitățile cqw din varianta HTML

const hex = (value: string): RGB => {
  const n = parseInt(value.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const C = {
  ivory: hex("#ffffff"),
  ink: hex("#0c0b0a"),
  stone: hex("#5f5750"),
  bronze: hex("#9a7a46"),
  champagne: hex("#c8aa6e"),
};

export type CertificatePdfData = {
  studentName: string;
  courseTitle: string;
  issuedAt: Date;
  code: string;
  signature: string;
  text: string; // fraza de sub nume
};

type TextStyle = { font: PDFFont; size: number; color: RGB; tracking?: number };

function textWidth(text: string, { font, size, tracking = 0 }: TextStyle) {
  return font.widthOfTextAtSize(text, size) + tracking * size * Math.max(text.length - 1, 0);
}

function draw(page: PDFPage, text: string, x: number, baseline: number, style: TextStyle) {
  const spacing = (style.tracking ?? 0) * style.size;
  if (spacing) page.pushOperators(setCharacterSpacing(spacing));
  page.drawText(text, { x, y: H - baseline, font: style.font, size: style.size, color: style.color });
  if (spacing) page.pushOperators(setCharacterSpacing(0));
}

function drawCentered(page: PDFPage, text: string, centerX: number, baseline: number, style: TextStyle) {
  draw(page, text, centerX - textWidth(text, style) / 2, baseline, style);
}

// Cea mai mare mărime (până la `max`) la care textul încape în `maxLines` rânduri de lățime `maxWidth`.
function fitLines(text: string, font: PDFFont, max: number, min: number, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  for (let size = max; size >= min; size -= 0.5) {
    const lines: string[] = [];
    for (const word of words) {
      const candidate = lines.length ? `${lines[lines.length - 1]} ${word}` : word;
      if (lines.length && font.widthOfTextAtSize(candidate, size) <= maxWidth) lines[lines.length - 1] = candidate;
      else lines.push(word);
    }
    if (lines.length <= maxLines && lines.every((l) => font.widthOfTextAtSize(l, size) <= maxWidth)) return { size, lines };
  }
  return { size: min, lines: [text] };
}

const dateFormat = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", year: "numeric" });

export async function renderCertificatePdf(data: CertificatePdfData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`Certificat de absolvire — ${data.courseTitle}`);
  pdf.setAuthor("GJ Nail Academy");
  pdf.setSubject(`${data.studentName} · ${data.code}`);
  pdf.setCreator("GJ Nail Academy");

  const [displayBytes, italicBytes, sansBytes] = await Promise.all(
    ["PlayfairDisplay.ttf", "PlayfairDisplay-Italic.ttf", "Inter.ttf"].map((f) => readFile(path.join(FONT_DIR, f))),
  );
  const [display, italic, sans] = await Promise.all([
    pdf.embedFont(displayBytes, { subset: true }),
    pdf.embedFont(italicBytes, { subset: true }),
    // Inter e font variabil: reducerea la literele folosite îi strică glifele, așa că se include întreg.
    pdf.embedFont(sansBytes),
  ]);

  const page = pdf.addPage([W, H]);
  const cx = W / 2;
  const contentWidth = W - 2 * 9 * u;

  // Fundal și rame aurii
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.ivory });
  const frame = (inset: number, thickness: number, opacity: number) =>
    page.drawRectangle({
      x: inset,
      y: inset,
      width: W - 2 * inset,
      height: H - 2 * inset,
      borderColor: C.champagne,
      borderWidth: thickness,
      borderOpacity: opacity,
    });
  frame(2.6 * u + 0.175 * u, 0.35 * u, 1);
  frame(3.6 * u + 0.06 * u, 0.12 * u, 0.6);

  // Antet: monogramă și titlu
  drawCentered(page, "GJ", cx, 7.5 * u + 3.4 * u, { font: italic, size: 4.2 * u, color: C.bronze });
  drawCentered(page, "NAIL ACADEMY", cx, 13.3 * u, { font: display, size: 1.25 * u, color: C.stone, tracking: 0.35 });
  drawCentered(page, "CERTIFICAT DE ABSOLVIRE", cx, 19.6 * u, { font: display, size: 3.6 * u, color: C.ink, tracking: 0.12 });
  page.drawRectangle({ x: cx - 4.5 * u, y: H - 22 * u, width: 9 * u, height: 0.12 * u, color: C.champagne });

  // Numele elevului și cursul
  drawCentered(page, "SE ACORDĂ", cx, 26.4 * u, { font: sans, size: 1.45 * u, color: C.stone, tracking: 0.2 });

  const name = fitLines(data.studentName, italic, 5.6 * u, 2.8 * u, contentWidth, 1);
  drawCentered(page, name.lines[0], cx, 33.2 * u, { font: italic, size: name.size, color: C.bronze });

  drawCentered(page, data.text, cx, 37.6 * u, { font: sans, size: 1.55 * u, color: C.stone });

  const course = fitLines(data.courseTitle, display, 3.1 * u, 1.9 * u, contentWidth, 2);
  course.lines.forEach((line, i) =>
    drawCentered(page, line, cx, 41.8 * u + i * course.size * 1.2, { font: display, size: course.size, color: C.ink }),
  );

  // Subsol: dată, semnătură, cod
  const label = { font: sans, size: 1.3 * u, color: C.stone };
  const value = { font: sans, size: 1.3 * u, color: C.ink };
  const left = 9 * u;
  const right = W - 9 * u;
  const labelLine = H - 6.5 * u - 2.2 * u;
  const valueLine = H - 6.5 * u;

  draw(page, "Data", left, labelLine, label);
  draw(page, dateFormat.format(data.issuedAt), left, valueLine, value);

  page.drawRectangle({ x: cx - 9 * u, y: 6.5 * u + 4.2 * u, width: 18 * u, height: 0.08 * u, color: C.ink, opacity: 0.4 });
  drawCentered(page, data.signature, cx, labelLine, value);
  drawCentered(page, "Instructoare", cx, valueLine, label);

  draw(page, "Cod certificat", right - textWidth("Cod certificat", label), labelLine, label);
  const codeStyle = { ...value, tracking: 0.05 };
  draw(page, data.code, right - textWidth(data.code, codeStyle), valueLine, codeStyle);

  return pdf.save();
}
