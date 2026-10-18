'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendContactMessage, type ContactFormState } from '@/lib/actions/contact.actions'
import { cn } from '@/lib/utils'

const initialState: ContactFormState = { ok: false, message: '' }

const inputClass =
  'mt-1.5 block w-full border border-champagne/20 bg-ivory px-4 py-3 text-[16px] text-ink placeholder:text-stone/50 outline-none transition-colors hover:border-champagne focus:border-bronze focus:ring-1 focus:ring-bronze aria-[invalid=true]:border-red-600'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center bg-ink px-8 text-[14px] font-medium text-ivory transition hover:bg-ink-soft disabled:opacity-60 sm:w-auto"
    >
      {pending ? 'Se trimite…' : 'Trimite mesajul'}
    </button>
  )
}

export function ContactForm() {
  const [state, action] = useActionState(sendContactMessage, initialState)

  if (state.ok) {
    return (
      <p role="status" className="border-l-2 border-emerald-600 bg-emerald-50 px-5 py-4 text-[15px] text-emerald-900">
        {state.message}
      </p>
    )
  }

  const field = (key: string) => ({
    defaultValue: state.values?.[key] ?? '',
    ...(state.errors?.[key] ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {}),
  })
  const error = (key: string) =>
    state.errors?.[key] && (
      <p id={`${key}-error`} className="mt-1.5 text-[12px] text-red-700">
        {state.errors[key]}
      </p>
    )

  return (
    <form action={action} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-[13px] font-medium text-ink">
            Nume
          </label>
          <input id="name" name="name" autoComplete="name" required maxLength={100} className={inputClass} {...field('name')} />
          {error('name')}
        </div>
        <div>
          <label htmlFor="email" className="text-[13px] font-medium text-ink">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} className={inputClass} {...field('email')} />
          {error('email')}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-[13px] font-medium text-ink">
          Mesaj
        </label>
        <textarea id="message" name="message" rows={6} required maxLength={3000} className={cn(inputClass, 'resize-y')} {...field('message')} />
        {error('message')}
      </div>

      {/* Capcană pentru roboți: ascunsă pentru oameni și cititoare de ecran. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Site</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && (
        <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-[14px] text-red-800">
          {state.message}
        </p>
      )}

      <Submit />
    </form>
  )
}
