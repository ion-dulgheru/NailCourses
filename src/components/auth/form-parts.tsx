'use client';

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Piese comune pentru formularele de cont (fundal negru, accente aurii).

export const inputClass =
  "mt-1 block h-11 w-full rounded-none border-0 border-b border-champagne/20 bg-transparent px-0 text-[16px] text-ivory placeholder:text-ivory/25 outline-none transition-colors hover:border-ivory/40 focus:border-champagne";

export const linkClass =
  "text-champagne-light underline decoration-champagne/40 underline-offset-4 transition-colors hover:text-ivory hover:decoration-ivory";

export function FormHeader({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <header>
      <p className="text-[14px] text-champagne-light/80">{eyebrow}</p>
      <h1 className="mt-3 font-display text-[44px] leading-[1] font-light tracking-[-0.01em] text-ivory sm:text-[52px]">
        {title} <em className="text-champagne italic">{accent}</em>
      </h1>
      <p className="mt-4 text-[15px] leading-[1.6] text-ivory/65">{children}</p>
    </header>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="border-l-2 border-red-400 bg-red-500/10 px-4 py-3 text-[14px] leading-[1.5] text-red-200"
    >
      {message}
    </div>
  );
}

export function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("group", className)}>
      <label
        htmlFor={id}
        className="block text-[13px] text-ivory/60 transition-colors group-focus-within:text-champagne-light"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function PasswordInput({
  id,
  autoComplete,
  describedBy,
  minLength,
}: {
  id: string;
  autoComplete: "new-password" | "current-password";
  describedBy?: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        id={id}
        name={id}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        className={cn(inputClass, "pr-10")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ascunde parola" : "Arată parola"}
        aria-pressed={visible}
        className="absolute right-0 bottom-0 flex h-11 w-10 items-center justify-end text-ivory/40 transition-colors hover:text-champagne-light"
      >
        {visible ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
      </button>
    </div>
  );
}

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-[52px] w-full items-center justify-center gap-3 bg-champagne px-7 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-champagne-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne",
        pending && "cursor-wait opacity-70 hover:bg-champagne",
      )}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
