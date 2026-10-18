import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { ButtonLink } from '@/components/home/primitives'
import { CheckoutShell } from '@/components/checkout/checkout-shell'
import { getCurrentUser } from '@/lib/current-user'
import { getOwnOrder } from '@/lib/payments'

export const metadata: Metadata = { title: 'Plata nu a reușit — GJ Nail Academy' }

type Props = { searchParams: Promise<{ comanda?: string }> }

export default async function CheckoutFailurePage({ searchParams }: Props) {
  const { comanda } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect(`/autentificare?callbackUrl=${encodeURIComponent(`/checkout/esec?comanda=${comanda ?? ''}`)}`)

  const order = await getOwnOrder(comanda, user.id)
  if (!order) notFound()
  if (order.status !== 'esuata') redirect(`/checkout/succes?comanda=${order.id}`)

  return (
    <CheckoutShell eyebrow="Plată" title="Plata nu a reușit">
      <div className="max-w-[560px]">
        <XCircle className="size-10 text-red-700" strokeWidth={1.3} aria-hidden="true" />
        <p className="mt-6 text-[16px] leading-[1.7] text-stone">
          Plata pentru <span className="text-ink">{order.course.title}</span> nu a fost finalizată. Poți încerca
          din nou, eventual cu alt card.
        </p>
        <ButtonLink href={`/checkout/${order.course.slug}`} className="mt-8 h-[52px] px-10">
          Încearcă din nou
        </ButtonLink>
        <p className="mt-6 text-[14px] text-stone">
          Problema continuă?{' '}
          <Link href="/contact" className="text-ink underline decoration-champagne/50 underline-offset-4 hover:decoration-bronze">
            Scrie-ne
          </Link>
        </p>
      </div>
    </CheckoutShell>
  )
}
