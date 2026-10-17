'use client'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'
import { adminButton } from './styles'

// Piese de interfață comune pentru panoul de administrare (fundal deschis, accente bronz).

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: React.ReactNode
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-bronze">{eyebrow}</p>
        )}
        <h1 className="mt-1.5 font-display text-[34px] leading-tight text-ink sm:text-[40px]">{title}</h1>
        {description && <p className="mt-2 text-[14px] text-stone">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  )
}

export function AdminCard({
  title,
  description,
  className,
  children,
}: {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('border border-line bg-ivory', className)}>
      {title && (
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h2 className="font-display text-[22px] leading-tight text-ink">{title}</h2>
          {description && <p className="mt-1 text-[13px] text-stone">{description}</p>}
        </div>
      )}
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  )
}

export function AdminField({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-red-700">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[12px] text-stone">{hint}</p>
      )}
    </div>
  )
}

export function FormMessage({ state }: { state: { ok: boolean; message: string } }) {
  if (!state.message) return null
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={cn(
        'border-l-2 px-4 py-2.5 text-[13px]',
        state.ok ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-red-600 bg-red-50 text-red-800',
      )}
    >
      {state.message}
    </p>
  )
}

export function SaveButton({ label = 'Salvează', pendingLabel = 'Se salvează…' }: { label?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={adminButton.primary}>
      {pending ? pendingLabel : label}
    </button>
  )
}

export function StatusBadge({ status }: { status: 'ciorna' | 'publicat' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em]',
        status === 'publicat' ? 'bg-emerald-50 text-emerald-800' : 'bg-stone/10 text-stone',
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', status === 'publicat' ? 'bg-emerald-600' : 'bg-stone/60')}
      />
      {status === 'publicat' ? 'Publicat' : 'Ciornă'}
    </span>
  )
}

// Buton pentru acțiuni ireversibile: primul click cere confirmare, al doilea execută.
export function ConfirmButton({
  action,
  label,
  confirmLabel,
  className = adminButton.danger,
}: {
  action: () => Promise<unknown>
  label: React.ReactNode
  confirmLabel: string
  className?: string
}) {
  const [armed, setArmed] = useState(false)
  const [pending, startTransition] = useTransition()

  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} className={className}>
        {label}
      </button>
    )
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => void (await action()))}
        className={cn(adminButton.danger, 'border-red-600 bg-red-600 text-ivory hover:border-red-700 hover:bg-red-700')}
      >
        {pending ? 'Se execută…' : confirmLabel}
      </button>
      <button type="button" disabled={pending} onClick={() => setArmed(false)} className={adminButton.secondary}>
        Anulează
      </button>
    </span>
  )
}
