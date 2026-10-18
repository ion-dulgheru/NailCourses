'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { startCheckout, type CheckoutState } from '@/lib/actions/checkout.actions'

const initialState: CheckoutState = { message: '' }

function PayButton({ price }: { price: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 bg-champagne px-8 text-[15px] font-medium text-ink transition-colors hover:bg-champagne-light disabled:opacity-70"
    >
      <Lock className="size-4" strokeWidth={1.6} aria-hidden="true" />
      {pending ? 'Se deschide pagina de plată…' : `Plătește ${price}`}
    </button>
  )
}

export function CheckoutForm({ slug, price }: { slug: string; price: string }) {
  const [state, action] = useActionState(startCheckout, initialState)

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />

      <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.6] text-stone">
        <input type="checkbox" name="acceptTerms" required className="mt-1 size-4 shrink-0 accent-bronze" />
        <span>
          Sunt de acord cu{' '}
          <Link href="/termeni-si-conditii" target="_blank" className="text-ink underline decoration-champagne/50 underline-offset-4 hover:decoration-bronze">
            termenii și condițiile
          </Link>{' '}
          și cu{' '}
          <Link href="/politica-de-rambursare" target="_blank" className="text-ink underline decoration-champagne/50 underline-offset-4 hover:decoration-bronze">
            politica de rambursare
          </Link>
          . Accesul la curs începe imediat după confirmarea plății.
        </span>
      </label>

      {state.message && (
        <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-[14px] text-red-800">
          {state.message}
        </p>
      )}

      <PayButton price={price} />

      <p className="text-[13px] leading-[1.6] text-stone">
        Vei fi redirecționată către pagina securizată a băncii. Datele cardului nu ajung la noi.
      </p>
    </form>
  )
}
