// Verifică setările SMTP din .env și trimite un email de probă.
// Rulare: pnpm tsx scripts/test-email.ts adresa@exemplu.com
import "dotenv/config";
import nodemailer from "nodemailer";

const to = process.argv[2];
const { SMTP_HOST, SMTP_PORT = "465", SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

if (!to) throw new Error("Scrie adresa: pnpm tsx scripts/test-email.ts adresa@exemplu.com");
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error("Lipsesc SMTP_HOST, SMTP_USER sau SMTP_PASS din .env");

const port = Number(SMTP_PORT);
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  requireTLS: port !== 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

await transporter.verify();
console.log("✓ Conectare și autentificare SMTP reușite");

await transporter.sendMail({
  from: EMAIL_FROM || `GJ Nail Academy <${SMTP_USER}>`,
  to,
  subject: "Test email — GJ Nail Academy",
  text: "Dacă vezi acest mesaj, emailurile site-ului funcționează.",
});
console.log(`✓ Email de probă trimis către ${to}`);
