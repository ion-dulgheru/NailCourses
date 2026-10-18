import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { ButtonLink, container } from '@/components/home/primitives'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { requireStudent } from '@/lib/student'
import { prisma } from '@/lib/db'
import { formatMdl } from '@/lib/course-format'

export const metadata: Metadata = {
  title: 'Istoric comenzi — GJ Nail Academy',
  robots: { index: false },
}

const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })

export default async function OrderHistoryPage() {
  const user = await requireStudent('/cont/comenzi')
  const [orders, enrollments] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { course: { select: { title: true, slug: true } } },
    }),
    prisma.enrollment.findMany({ where: { userId: user.id }, select: { courseId: true } }),
  ])
  // „Încearcă din nou” n-are sens pentru un curs la care elevul are deja acces.
  const enrolled = new Set(enrollments.map((e) => e.courseId))

  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-32 pb-12 text-ivory lg:pt-40 lg:pb-16">
          <div className={container}>
            <Link
              href="/cont"
              className="inline-flex items-center gap-2 text-[13px] text-ivory/60 transition-colors hover:text-champagne-light"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Contul meu
            </Link>
            <h1 className="mt-4 font-display text-[44px] leading-[1] font-light tracking-[-0.015em] sm:text-[56px]">
              Istoric comenzi
            </h1>
            <p className="mt-4 max-w-[34rem] text-[15px] text-ivory/70">
              Toate plățile tale. Accesul la un curs apare automat după ce banca confirmă plata.
            </p>
          </div>
        </section>

        <section className={`${container} py-12 lg:py-16`}>
          {orders.length === 0 ? (
            <div className="max-w-md">
              <p className="font-display text-[26px] text-ink">Nu ai nicio comandă încă.</p>
              <p className="mt-3 text-[15px] text-stone">Când cumperi un curs, plata apare aici.</p>
              <ButtonLink href="/cursuri" className="mt-8">
                Vezi cursurile
              </ButtonLink>
            </div>
          ) : (
            <ul className="divide-y divide-champagne/20 border-y border-champagne/20">
              {orders.map((o) => (
                <li key={o.id} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">
                  <div className="min-w-0">
                    <p className="font-display text-[21px] leading-snug text-ink">{o.course.title}</p>
                    <p className="mt-1 font-mono text-[12px] text-stone">{dateFormat.format(o.createdAt)}</p>
                  </div>
                  <p className="font-mono text-[15px] text-ink">{formatMdl(o.amountMdl)}</p>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <OrderStatusBadge status={o.status} />
                    {o.status === 'platita' && (
                      <Link
                        href={`/cursurile-mele/${o.course.slug}`}
                        className="text-[13px] text-bronze underline underline-offset-4 hover:text-ink"
                      >
                        Mergi la curs
                      </Link>
                    )}
                    {(o.status === 'esuata' || o.status === 'in_asteptare') && !enrolled.has(o.courseId) && (
                      <Link
                        href={`/checkout/${o.course.slug}`}
                        className="text-[13px] text-bronze underline underline-offset-4 hover:text-ink"
                      >
                        Încearcă din nou
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 text-[14px] text-stone">
            O plată nu apare corect?{' '}
            <Link href="/contact" className="text-bronze underline underline-offset-4 hover:text-ink">
              Scrie-ne
            </Link>
            .
          </p>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}
