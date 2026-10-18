import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { formatMdl } from '@/lib/course-format'
import { ORDER_STATUS, parseOrderStatus } from '@/lib/orders'
import { AdminPageHeader } from '@/components/admin/ui'
import { RefundButton } from '@/components/admin/refund-button'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Comenzi' }

const PAGE_SIZE = 100
const dateFormat = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ stare?: string }> }) {
  await requireAdminPage('/admin/comenzi')

  const status = parseOrderStatus((await searchParams).stare)
  const where = status ? { status } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      include: {
        user: { select: { id: true, name: true, surname: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.order.count({ where }),
  ])

  const filters = [
    { label: 'Toate', param: undefined },
    ...Object.entries(ORDER_STATUS).map(([param, { label }]) => ({ label, param })),
  ]

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Plăți"
        title="Comenzi"
        description="Toate plățile prin maib. Accesul la curs se acordă automat după confirmarea băncii."
      />

      <nav aria-label="Filtrează după stare">
        <ul className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = f.param === status
            return (
              <li key={f.label}>
                <Link
                  href={f.param ? `/admin/comenzi?stare=${f.param}` : '/admin/comenzi'}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-9 items-center border px-4 text-[13px] transition-colors',
                    active ? 'border-ink bg-ink text-ivory' : 'border-champagne/20 bg-ivory text-stone hover:border-ink hover:text-ink',
                  )}
                >
                  {f.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <p className="text-[13px] text-stone">
        {total} {total === 1 ? 'comandă' : 'comenzi'}
        {total > PAGE_SIZE && ` · se afișează ultimele ${PAGE_SIZE}`}
      </p>

      {orders.length === 0 ? (
        <div className="border border-dashed border-champagne/20 bg-ivory px-6 py-12 text-center text-[14px] text-stone">
          {status ? 'Nicio comandă în această stare.' : 'Încă nu există comenzi. Ele vor apărea aici după activarea plăților.'}
        </div>
      ) : (
        <div className="overflow-x-auto border border-champagne/20 bg-ivory">
          <table className="w-full min-w-[860px] text-left text-[14px]">
            <thead className="border-b border-champagne/20 bg-sand/60 text-[12px] text-stone">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Data</th>
                <th scope="col" className="px-5 py-3 font-medium">Elev</th>
                <th scope="col" className="px-5 py-3 font-medium">Curs</th>
                <th scope="col" className="px-5 py-3 font-medium">Sumă</th>
                <th scope="col" className="px-5 py-3 font-medium">Stare</th>
                <th scope="col" className="px-5 py-3 font-medium">Tranzacție maib</th>
                <th scope="col" className="px-5 py-3"><span className="sr-only">Acțiuni</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne/20/70">
              {orders.map((o) => (
                <tr key={o.id} className="align-top transition-colors hover:bg-sand/40">
                  <td className="px-5 py-3.5 whitespace-nowrap text-stone">{dateFormat.format(o.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/elevi/${o.user.id}`} className="font-medium text-ink hover:text-bronze">
                      {[o.user.surname, o.user.name].filter(Boolean).join(' ')}
                    </Link>
                    <p className="text-[12px] text-stone">{o.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{o.course.title}</td>
                  <td className="px-5 py-3.5 font-mono whitespace-nowrap text-ink">{formatMdl(o.amountMdl)}</td>
                  <td className="px-5 py-3.5"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-stone">{o.maibTransactionId ?? '—'}</td>
                  <td className="px-5 py-3.5 text-right">
                    {o.status === 'platita' && <RefundButton orderId={o.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[12px] text-stone">
        „Marchează rambursată” doar înregistrează rambursarea și retrage accesul la curs. Banii se returnează din
        contul maib.
      </p>
    </div>
  )
}
