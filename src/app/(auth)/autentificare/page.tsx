import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import LoginClient from "../oAuth";
import { AuthShell } from "@/components/auth/auth-shell";
import { safeCallbackUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Autentificare — GJ Nail Academy",
  description: "Intră în contul tău pentru a continua cursurile de manichiură.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; parola?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);

  if (await getCurrentUser()) {
    redirect(callbackUrl);
  }

  return (
    <AuthShell>
      <LoginClient callbackUrl={callbackUrl} passwordChanged={params.parola === "noua"} />
    </AuthShell>
  );
}
