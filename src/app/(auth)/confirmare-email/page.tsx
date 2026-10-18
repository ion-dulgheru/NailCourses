import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormHeader, linkClass } from "@/components/auth/form-parts";
import { prisma } from "@/lib/db";
import { verifyEmailToken } from "@/lib/email-verification";

export const metadata: Metadata = {
  title: "Confirmare email — GJ Nail Academy",
  robots: { index: false },
};

// Pagina deschisă din linkul din email: marchează adresa ca fiind confirmată.
export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const user = await verifyEmailToken(token);

  if (user && !user.emailVerified) {
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
  }

  return (
    <AuthShell>
      <div className="w-full max-w-[420px]">
        {user ? (
          <FormHeader eyebrow="Cont activat" title="Email" accent="confirmat">
            Mulțumim! Adresa <span className="text-ivory">{user.email}</span> a fost confirmată. Acum
            poți intra în cont.
          </FormHeader>
        ) : (
          <FormHeader eyebrow="Confirmare email" title="Linkul nu mai" accent="este valabil">
            Linkurile de confirmare expiră după 24 de ore. Încearcă să intri în cont: dacă emailul nu
            e confirmat, vei putea cere un link nou.
          </FormHeader>
        )}
        <p className="mt-9 border-t border-champagne/15 pt-8 text-[14px]">
          <Link href="/autentificare" className={linkClass}>
            Intră în cont
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
