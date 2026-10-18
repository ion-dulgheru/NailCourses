'use client';

import { useActionState } from "react";
import Link from "next/link";
import { Award, PlayCircle, ShieldCheck } from "lucide-react";
import { signUpUser } from "@/lib/actions/user.actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/validators";
import {
  Field,
  FormError,
  FormHeader,
  PasswordInput,
  SubmitButton,
  inputClass,
  linkClass,
} from "@/components/auth/form-parts";

const perks = [
  { icon: ShieldCheck, label: "Plată securizată" },
  { icon: PlayCircle, label: "Acces imediat" },
  { icon: Award, label: "Certificat final" },
];

export default function SignUpForm({ callbackUrl }: { callbackUrl: string }) {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const loginHref =
    callbackUrl === "/" ? "/autentificare" : `/autentificare?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="w-full max-w-[420px]">
      <FormHeader eyebrow="Cont nou" title="Creează-ți" accent="contul">
        Un singur cont pentru toate cursurile tale, cu acces oricând, de pe telefon sau calculator.
      </FormHeader>

      <form action={action} className="mt-9 space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <FormError message={data.success ? undefined : data.message} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field id="name" label="Nume">
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="family-name"
              defaultValue={data.fields?.name}
              placeholder="Moraru"
              className={inputClass}
            />
          </Field>
          <Field id="surname" label="Prenume">
            <input
              type="text"
              id="surname"
              name="surname"
              required
              autoComplete="given-name"
              defaultValue={data.fields?.surname}
              placeholder="Andreea"
              className={inputClass}
            />
          </Field>
        </div>

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

        <Field id="confirmPassword" label="Confirmă parola">
          <PasswordInput id="confirmPassword" autoComplete="new-password" />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[1.6] text-ivory/60">
          <input type="checkbox" name="acceptTerms" required className="peer sr-only" />
          <span
            aria-hidden="true"
            className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center border border-ivory/35 transition-colors peer-checked:border-champagne peer-checked:bg-champagne peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
          >
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-ink" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2.5 6.2 5 8.5l4.5-5" />
            </svg>
          </span>
          <span>
            Sunt de acord cu{" "}
            <Link href="/termeni-si-conditii" target="_blank" className={linkClass}>
              termenii și condițiile
            </Link>{" "}
            și{" "}
            <Link href="/politica-de-confidentialitate" target="_blank" className={linkClass}>
              politica de confidențialitate
            </Link>
            .
          </span>
        </label>

        <SubmitButton label="Creează contul" pendingLabel="Se creează contul" />
      </form>

      <ul className="mt-8 grid grid-cols-3 gap-2 border-y border-champagne/15 py-5">
        {perks.map(({ icon: Icon, label }) => (
          <li key={label} className="flex flex-col items-start gap-2">
            <Icon size={18} strokeWidth={1.25} className="text-champagne" aria-hidden="true" />
            <span className="text-[13px] leading-[1.3] text-ivory/60">{label}</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[14px] text-ivory/60">
        Ai deja cont?{" "}
        <Link href={loginHref} className={linkClass}>
          Autentifică-te
        </Link>
      </p>
    </div>
  );
}
