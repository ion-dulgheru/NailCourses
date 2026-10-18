import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { InvalidResetLink, ResetPasswordForm } from "@/components/auth/password-reset-forms";
import { verifyResetToken } from "@/lib/password-reset";

export const metadata: Metadata = {
  title: "Parolă nouă — GJ Nail Academy",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const valid = await verifyResetToken(token);

  return (
    <AuthShell>
      {valid && token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <InvalidResetLink />
      )}
    </AuthShell>
  );
}
