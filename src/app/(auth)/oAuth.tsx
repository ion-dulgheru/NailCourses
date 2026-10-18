'use client';

import { useActionState } from "react";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import {
  Field,
  FormError,
  FormHeader,
  PasswordInput,
  SubmitButton,
  inputClass,
  linkClass,
} from "@/components/auth/form-parts";

export default function LoginClient({
  callbackUrl,
  passwordChanged = false,
}: {
  callbackUrl: string;
  passwordChanged?: boolean;
}) {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const registerHref =
    callbackUrl === "/"
      ? "/inregistrare"
      : `/inregistrare?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="w-full max-w-[420px]">
      <FormHeader eyebrow="Bine ai revenit" title="Intră în" accent="contul tău">
        Continuă cursurile de unde ai rămas.
      </FormHeader>

      <form action={action} className="mt-9 space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {passwordChanged && !data.message && (
          <p role="status" className="border border-champagne/30 px-4 py-3 text-[14px] text-ivory/85">
            Parola a fost schimbată. Intră în cont cu parola nouă.
          </p>
        )}

        <FormError message={data.success ? undefined : data.message} />

        <Field id="email" label="Email">
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={data.fields?.email}
            placeholder="nume@exemplu.com"
            className={inputClass}
          />
        </Field>

        <Field id="password" label="Parolă">
          <PasswordInput id="password" autoComplete="current-password" />
          <p className="mt-3 text-right text-[13px]">
            <Link href="/parola-uitata" className={linkClass}>
              Ai uitat parola?
            </Link>
          </p>
        </Field>

        <div className="pt-2">
          <SubmitButton label="Intră în cont" pendingLabel="Se verifică" />
        </div>
      </form>

      <div className="mt-10 border-t border-champagne/15 pt-8">
        <p className="text-[14px] text-ivory/60">Nu ai încă un cont?</p>
        <Link
          href={registerHref}
          className="mt-4 inline-flex h-12 w-full items-center justify-center border border-ivory/25 text-[15px] text-ivory transition-colors hover:border-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
        >
          Creează cont
        </Link>
        <p className="mt-6 text-[13px] text-ivory/45">
          Ai nevoie de ajutor?{" "}
          <Link href="/contact" className={linkClass}>
            Scrie-ne
          </Link>
        </p>
      </div>
    </div>
  );
}
