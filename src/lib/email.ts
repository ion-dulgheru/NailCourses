import "server-only";

// Punctul unic prin care site-ul trimite emailuri. Serviciul tranzacțional (ex: Resend) se
// conectează aici în etapa „emailuri”; până atunci nimic nu pleacă, iar apelantul primește
// `false` ca să poată afișa o alternativă (ex: adresa de email de contact).
export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export function isEmailConfigured() {
  return false;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email neconfigurat] către ${message.to}: ${message.subject}`);
    }
    return false;
  }
  return false;
}
