import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { AdminCard, AdminPageHeader } from '@/components/admin/ui'
import { adminButton } from '@/components/admin/styles'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatMdl } from '@/lib/course-format'

const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })

// Interogările panoului, în afara componentei (calculul ferestrei de 30 de zile nu ține de randare).
function loadDashboard() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  return Promise.all([
    prisma.user.count({ where: { role: 'elev' } }),
    prisma.course.count({ where: { status: 'publicat' } }),
    prisma.course.count({ where: { status: 'ciorna' } }),
    prisma.enrollment.count(),
    prisma.enrollment.findMany({
      orderBy: { grantedAt: 'desc' },
      take: 6,
      include: {
        user: { select: { id: true, name: true, surname: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.order.aggregate({
      where: { status: 'platita', paidAt: { gte: since } },
      _sum: { amountMdl: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.order.count({ where: { status: { in: ['in_asteptare', 'esuata'] }, createdAt: { gte: since } } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { id: true, name: true, surname: true } },
        course: { select: { title: true } },
      },
    }),
  ])
}

export default async function AdminDashboard() {
  await requireAdminPage()

  const [students, published, drafts, enrollments, recent, paid30, orders30, unresolved, recentOrders] =
    await loadDashboard()

  const stats = [
    { label: 'Elevi înregistrați', value: students, href: '/admin/elevi' },
    { label: 'Cursuri publicate', value: published, href: '/admin/cursuri' },
    { label: 'Cursuri ciornă', value: drafts, href: '/admin/cursuri' },
    { label: 'Accese acordate', value: enrollments, href: '/admin/elevi' },
    { label: 'Venit, ultimele 30 de zile', value: formatMdl(paid30._sum.amountMdl ?? 0), href: '/admin/comenzi?stare=platita' },
    { label: 'Comenzi, ultimele 30 de zile', value: orders30, href: '/admin/comenzi' },
    { label: 'Eșuate sau în așteptare (30 de zile)', value: unresolved, href: '/admin/comenzi?stare=in_asteptare' },
  ]

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Bine ai revenit"
        title="Panou"
        description="Imaginea de ansamblu a academiei."
        actions={
          <>
            <Link href="/admin/elevi" className={adminButton.secondary}>
              Acordă acces unui elev
            </Link>
            <Link href="/admin/cursuri/nou" className={adminButton.primary}>
              Curs nou
            </Link>
          </>
        }
      />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className="block h-full border border-line bg-ivory px-5 py-5 transition-colors hover:border-champagne"
            >
              <p className="font-display text-[34px] leading-none text-ink sm:text-[40px]">{s.value}</p>
              <p className="mt-2 text-[13px] text-stone">{s.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <AdminCard title="Ultimele comenzi">
        {recentOrders.length === 0 ? (
          <p className="text-[14px] text-stone">Încă nu există comenzi. Ele apar aici după activarea plăților.</p>
        ) : (
          <ul className="-my-3 divide-y divide-line/70">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`/admin/elevi/${o.user.id}`} className="text-[14px] font-medium text-ink hover:text-bronze">
                    {[o.user.surname, o.user.name].filter(Boolean).join(' ')}
                  </Link>
                  <span className="text-[13px] text-stone"> · {o.course.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-[12px] text-stone">
                  <span className="text-ink">{formatMdl(o.amountMdl)}</span>
                  <OrderStatusBadge status={o.status} />
                  {dateFormat.format(o.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <AdminCard title="Ultimele accese acordate">
        {recent.length === 0 ? (
          <p className="text-[14px] text-stone">
            Niciun elev nu are încă acces la un curs.{' '}
            <Link href="/admin/elevi" className="text-bronze underline underline-offset-4 hover:text-ink">
              Acordă primul acces
            </Link>
            .
          </p>
        ) : (
          <ul className="-my-3 divide-y divide-line/70">
            {recent.map((e) => (
              <li key={e.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/admin/elevi/${e.user.id}`}
                    className="text-[14px] font-medium text-ink hover:text-bronze"
                  >
                    {[e.user.surname, e.user.name].filter(Boolean).join(' ')}
                  </Link>
                  <span className="text-[13px] text-stone"> · {e.course.title}</span>
                </div>
                <p className="shrink-0 text-[12px] text-stone">
                  {e.source === 'manual' ? 'Acordat manual' : 'Plată'} · {dateFormat.format(e.grantedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  )
}
