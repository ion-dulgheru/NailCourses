import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { ButtonLink } from '@/components/home/primitives'
import { CheckoutShell } from '@/components/checkout/checkout-shell'
import { AutoRefresh } from '@/components/checkout/auto-refresh'
import { getCurrentUser } from '@/lib/current-user'
import { formatMdl } from '@/lib/course-format'
import { getOwnOrder } from '@/lib/payments'

export const metadata: Metadata = { title: 'Plata — GJ Nail Academy' }

type Props = { searchParams: Promise<{ comanda?: string }> }

// Pagina doar AFIȘEAZĂ starea comenzii; accesul îl acordă callback-ul băncii.
export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { comanda } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect(`/autentificare?callbackUrl=${encodeURIComponent(`/checkout/succes?comanda=${comanda ?? ''}`)}`)

  const order = await getOwnOrder(comanda, user.id)
  if (!order) notFound()
  if (order.status === 'esuata') redirect(`/checkout/esec?comanda=${order.id}`)

  if (order.status === 'in_asteptare') {
    return (
      <CheckoutShell eyebrow="Plată" title="Plata se procesează">
        <div className="max-w-[560px]">
          <Loader2 className="size-10 animate-spin text-bronze" strokeWidth={1.3} aria-hidden="true" />
          <p role="status" className="mt-6 text-[16px] leading-[1.7] text-stone">
            Așteptăm confirmarea băncii pentru <span className="text-ink">{order.course.title}</span>. De obicei
            durează câteva secunde; pagina se actualizează singură.
          </p>
          <AutoRefresh />
          <p className="mt-8 text-[14px] text-stone">
            <Link href="/cont/comenzi" className="text-ink underline decoration-champagne/50 underline-offset-4 hover:decoration-bronze">
              Istoricul comenzilor
            </Link>
          </p>
        </div>
      </CheckoutShell>
    )
  }

  if (order.status === 'rambursata') {
    return (
      <CheckoutShell eyebrow="Plată" title="Comandă rambursată">
        <p className="max-w-[560px] text-[16px] text-stone">
          Această comandă a fost rambursată, iar accesul la curs a fost închis.{' '}
          <Link href="/contact" className="text-ink underline underline-offset-4">
            Contactează-ne
          </Link>{' '}
          dacă ai întrebări.
        </p>
      </CheckoutShell>
    )
  }

  return (
    <CheckoutShell eyebrow="Plată reușită" title="Bun venit la curs!">
      <div className="max-w-[560px]">
        <CheckCircle2 className="size-10 text-emerald-700" strokeWidth={1.3} aria-hidden="true" />
        <p className="mt-6 font-display text-[30px] leading-snug text-ink">{order.course.title}</p>
        <p className="mt-3 text-[15px] leading-[1.7] text-stone">
          Plata de <span className="font-mono text-[14px] text-ink">{formatMdl(order.amountMdl)}</span> a fost confirmată. Ai acces la toate lecțiile, oricând, de pe
          telefon sau calculator.
        </p>
        <ButtonLink href={`/cursurile-mele/${order.course.slug}`} className="mt-8 h-[52px] px-10">
          Începe cursul
        </ButtonLink>
        <p className="mt-6 text-[14px] text-stone">
          <Link href="/cont/comenzi" className="underline decoration-champagne/50 underline-offset-4 hover:text-ink">
            Vezi istoricul comenzilor
          </Link>
        </p>
      </div>
    </CheckoutShell>
  )
}
