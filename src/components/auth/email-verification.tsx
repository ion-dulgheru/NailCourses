'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { resendVerificationEmail } from "@/lib/actions/user.actions";
import { FormHeader, linkClass } from "./form-parts";

function ResendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${linkClass} disabled:cursor-wait disabled:opacity-60`}>
      {pending ? "Se trimite…" : "Retrimite linkul de confirmare"}
    </button>
  );
}

// Buton de retrimitere a linkului; formular separat, ca să poată sta sub alt formular.
export function ResendVerification({ email }: { email: string }) {
  const [state, action] = useActionState(resendVerificationEmail, { message: "" });

  return (
    <form action={action} className="text-[14px] text-ivory/60">
      <input type="hidden" name="email" value={email} />
      <ResendButton />
      {state.message && (
        <p role="status" className="mt-2 text-[13px] text-ivory/70">
          {state.message}
        </p>
      )}
    </form>
  );
}

// Ce vede eleva după înregistrare: contul e creat, dar trebuie confirmat din email.
export function CheckEmailPanel({ email }: { email: string }) {
  return (
    <div className="w-full max-w-[420px]">
      <FormHeader eyebrow="Cont creat" title="Verifică" accent="emailul">
        Ți-am trimis un link de confirmare la <span className="text-ivory">{email}</span>. Apasă pe el
        ca să-ți activezi contul. Linkul e valabil 24 de ore.
      </FormHeader>

      <div className="mt-9 space-y-5 border-t border-champagne/15 pt-8 text-[14px] leading-[1.6] text-ivory/60">
        <p>Nu găsești emailul în câteva minute? Verifică dosarul Spam sau Promoții.</p>
        <ResendVerification email={email} />
        <p>
          <Link href="/autentificare" className={linkClass}>
            Am confirmat, vreau să intru în cont
          </Link>
        </p>
      </div>
    </div>
  );
}
