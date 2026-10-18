import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

// Punctul unic prin care site-ul trimite emailuri, prin SMTP (Gmail acum; Resend/Brevo se pot
// pune în loc schimbând doar variabilele SMTP_*). Fără configurare nimic nu pleacă, iar apelantul
// primește `false` ca să poată afișa o alternativă (ex: adresa de email de contact).
export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;

// Portul 465 folosește TLS de la început; 587 pornește necriptat și trece la TLS (STARTTLS).
function getTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email neconfigurat] către ${message.to}: ${message.subject}`);
    }
    return false;
  }

  try {
    await getTransporter().sendMail({
      // Gmail trimite doar în numele contului autentificat; EMAIL_FROM schimbă numele afișat.
      from: process.env.EMAIL_FROM || `GJ Nail Academy <${process.env.SMTP_USER}>`,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    });
    return true;
  } catch (error) {
    console.error(`[email] trimiterea către ${message.to} a eșuat:`, error);
    return false;
  }
}
