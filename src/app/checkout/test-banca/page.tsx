import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { FlaskConical } from 'lucide-react'
import { CheckoutShell, OrderSummary } from '@/components/checkout/checkout-shell'
import { simulateTestPayment } from '@/lib/actions/checkout.actions'
import { getCurrentUser } from '@/lib/current-user'
import { formatMdl } from '@/lib/course-format'
import { getOwnOrder, isTestPaymentMode } from '@/lib/payments'

export const metadata: Metadata = { title: 'Banca de test — GJ Nail Academy' }

type Props = { searchParams: Promise<{ comanda?: string }> }

// Ține locul paginii de plată maib în dezvoltare. În producție nu există (404).
export default async function TestBankPage({ searchParams }: Props) {
  if (!isTestPaymentMode()) notFound()

  const { comanda } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect(`/autentificare?callbackUrl=${encodeURIComponent(`/checkout/test-banca?comanda=${comanda ?? ''}`)}`)

  const order = await getOwnOrder(comanda, user.id)
  if (!order) notFound()
  if (order.status !== 'in_asteptare') {
    redirect(`/checkout/${order.status === 'platita' ? 'succes' : 'esec'}?comanda=${order.id}`)
  }

  const pay = simulateTestPayment.bind(null, order.id, 'succes')
  const fail = simulateTestPayment.bind(null, order.id, 'esec')

  return (
    <CheckoutShell eyebrow="Doar pentru dezvoltare" title="Banca de test">
      <div className="mx-auto max-w-[560px]">
        <p className="flex gap-3 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
          <FlaskConical className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
          Aici va apărea pagina de plată maib. Alege rezultatul plății ca să testezi fluxul complet.
        </p>

        <div className="mt-6">
          <OrderSummary
            title={order.course.title}
            coverImage={order.course.coverImage}
            coverAlt={order.course.coverAlt}
            price={formatMdl(order.amountMdl)}
            details={`Comanda ${order.id.slice(0, 8)}`}
          />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <form action={pay}>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center bg-emerald-700 px-6 text-[13px] font-medium text-ivory transition-colors hover:bg-emerald-800"
            >
              Plată reușită
            </button>
          </form>
          <form action={fail}>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center border border-red-300 bg-ivory px-6 text-[13px] font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              Plată respinsă / anulată
            </button>
          </form>
        </div>
      </div>
    </CheckoutShell>
  )
}
