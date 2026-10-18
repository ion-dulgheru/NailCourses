'use client';

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, resetPassword } from "@/lib/actions/password-reset.actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/validators";
import {
  Field,
  FormError,
  FormHeader,
  PasswordInput,
  SubmitButton,
  inputClass,
  linkClass,
} from "./form-parts";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, { message: "" });

  if (state.sent) {
    return (
      <div className="w-full max-w-[420px]">
        <FormHeader eyebrow="Resetare parolă" title="Verifică" accent="emailul">
          Dacă există un cont cu adresa introdusă, ți-am trimis un link pentru o parolă nouă. Linkul
          e valabil o oră.
        </FormHeader>
        <p className="mt-9 border-t border-champagne/15 pt-8 text-[14px] leading-[1.6] text-ivory/60">
          Nu primești emailul în câteva minute? Verifică dosarul Spam sau{" "}
          <Link href="/contact" className={linkClass}>
            scrie-ne
          </Link>
          .
        </p>
        <p className="mt-6 text-[14px]">
          <Link href="/autentificare" className={linkClass}>
            Înapoi la autentificare
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      <FormHeader eyebrow="Resetare parolă" title="Ai uitat" accent="parola?">
        Scrie adresa contului și îți trimitem un link pentru a alege o parolă nouă.
      </FormHeader>

      <form action={action} className="mt-9 space-y-6">
        <FormError message={state.message} />

        <Field id="email" label="Email">
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={state.fields?.email}
            placeholder="nume@exemplu.com"
            className={inputClass}
          />
        </Field>

        <div className="pt-2">
          <SubmitButton label="Trimite linkul" pendingLabel="Se trimite" />
        </div>
      </form>

      <p className="mt-10 border-t border-champagne/15 pt-8 text-[14px] text-ivory/60">
        Ți-ai amintit parola?{" "}
        <Link href="/autentificare" className={linkClass}>
          Autentifică-te
        </Link>
      </p>
    </div>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPassword, { message: "" });

  return (
    <div className="w-full max-w-[420px]">
      <FormHeader eyebrow="Resetare parolă" title="Alege o parolă" accent="nouă">
        După salvare te autentifici cu parola nouă.
      </FormHeader>

      <form action={action} className="mt-9 space-y-6">
        <input type="hidden" name="token" value={token} />

        <FormError message={state.message} />

        <Field id="password" label="Parola nouă">
          <PasswordInput
            id="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            describedBy="password-hint"
          />
          <p id="password-hint" className="mt-2 text-[12px] text-ivory/40">
            Minimum {PASSWORD_MIN_LENGTH} caractere.
          </p>
        </Field>

        <Field id="confirmPassword" label="Confirmă parola nouă">
          <PasswordInput id="confirmPassword" autoComplete="new-password" />
        </Field>

        <div className="pt-2">
          <SubmitButton label="Salvează parola" pendingLabel="Se salvează" />
        </div>
      </form>
    </div>
  );
}

export function InvalidResetLink() {
  return (
    <div className="w-full max-w-[420px]">
      <FormHeader eyebrow="Resetare parolă" title="Linkul nu mai" accent="este valabil">
        Linkurile de resetare expiră după o oră și pot fi folosite o singură dată.
      </FormHeader>
      <p className="mt-9 border-t border-champagne/15 pt-8 text-[14px]">
        <Link href="/parola-uitata" className={linkClass}>
          Cere un link nou
        </Link>
      </p>
    </div>
  );
}
