'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  changePassword,
  deleteAccount,
  updateName,
  type AccountFormState,
} from '@/lib/actions/account.actions'
import { PASSWORD_MIN_LENGTH } from '@/lib/validators'
import { cn } from '@/lib/utils'

const initialState: AccountFormState = { ok: false, message: '' }

const inputClass =
  'mt-1.5 block h-12 w-full border border-line bg-ivory px-4 text-[16px] text-ink placeholder:text-stone/50 outline-none transition-colors hover:border-champagne focus:border-bronze focus:ring-1 focus:ring-bronze aria-[invalid=true]:border-red-600'

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
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

function invalid(state: AccountFormState, key: string) {
  return state.errors?.[key] ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {}
}

function Submit({ label, pendingLabel, danger }: { label: string; pendingLabel: string; danger?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex h-11 items-center justify-center px-6 text-[12px] font-medium uppercase tracking-[0.14em] transition disabled:opacity-60',
        danger
          ? 'bg-red-700 text-ivory hover:bg-red-800'
          : 'bg-ink text-ivory hover:bg-ink-soft',
      )}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

function Status({ state }: { state: AccountFormState }) {
  if (!state.message) return null
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={cn('text-[13px]', state.ok ? 'text-emerald-800' : 'text-red-700')}
    >
      {state.message}
    </p>
  )
}

export function NameForm({ name, surname }: { name: string; surname: string }) {
  const [state, action] = useActionState(updateName, initialState)

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="surname" label="Prenume" error={state.errors?.surname}>
          <input id="surname" name="surname" autoComplete="given-name" defaultValue={surname} required className={inputClass} {...invalid(state, 'surname')} />
        </Field>
        <Field id="name" label="Nume" error={state.errors?.name}>
          <input id="name" name="name" autoComplete="family-name" defaultValue={name} required className={inputClass} {...invalid(state, 'name')} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Submit label="Salvează" pendingLabel="Se salvează…" />
        <Status state={state} />
      </div>
    </form>
  )
}

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, initialState)

  return (
    <form action={action} className="space-y-5">
      <Field id="currentPassword" label="Parola actuală" error={state.errors?.currentPassword}>
        <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} {...invalid(state, 'currentPassword')} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="newPassword" label="Parola nouă" error={state.errors?.newPassword} hint={`Minimum ${PASSWORD_MIN_LENGTH} caractere.`}>
          <input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={PASSWORD_MIN_LENGTH} required className={inputClass} {...invalid(state, 'newPassword')} />
        </Field>
        <Field id="confirmPassword" label="Confirmă parola nouă" error={state.errors?.confirmPassword}>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className={inputClass} {...invalid(state, 'confirmPassword')} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Submit label="Schimbă parola" pendingLabel="Se schimbă…" />
        <Status state={state} />
      </div>
    </form>
  )
}

export function DeleteAccountForm() {
  const [state, action] = useActionState(deleteAccount, initialState)
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center border border-red-200 px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-red-700 transition-colors hover:border-red-600 hover:bg-red-50"
      >
        Șterge contul
      </button>
    )
  }

  return (
    <form action={action} className="space-y-5 border border-red-200 bg-red-50/50 p-5">
      <p className="text-[14px] leading-[1.6] text-ink">
        Ștergerea este definitivă: pierzi accesul la toate cursurile, progresul și certificatele. Confirmă cu
        parola ta.
      </p>
      <Field id="password" label="Parola" error={state.errors?.password}>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} {...invalid(state, 'password')} />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <Submit label="Șterge definitiv contul" pendingLabel="Se șterge…" danger />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-11 items-center px-4 text-[13px] text-stone underline-offset-4 hover:text-ink hover:underline"
        >
          Anulează
        </button>
      </div>
      <Status state={state} />
    </form>
  )
}
