import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import SignUpForm from "../signUpform";
import { AuthShell } from "@/components/auth/auth-shell";
import { safeCallbackUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Creează cont — GJ Nail Academy",
  description: "Creează-ți contul pentru a cumpăra și urmări cursurile de manichiură.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const callbackUrl = safeCallbackUrl((await searchParams).callbackUrl);

  if (await getCurrentUser()) {
    redirect(callbackUrl);
  }

  return (
    <AuthShell>
      <SignUpForm callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
