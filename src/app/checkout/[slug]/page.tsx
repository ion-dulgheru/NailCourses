import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CheckoutShell, OrderSummary } from '@/components/checkout/checkout-shell'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { getCurrentUser } from '@/lib/current-user'
import { prisma } from '@/lib/db'
import { formatDuration, formatMdl, getPublishedCourse, lessonsLabel, levelLabel } from '@/lib/courses'
import { isTestPaymentMode } from '@/lib/payments'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { title: 'Finalizează comanda — GJ Nail Academy' }

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params
  const course = await getPublishedCourse(slug)
  if (!course) notFound()

  // Elevul nelogat se autentifică (sau își face cont) și revine aici.
  const user = await getCurrentUser()
  if (!user) redirect(`/autentificare?callbackUrl=${encodeURIComponent(`/checkout/${course.slug}`)}`)

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    select: { id: true },
  })
  if (enrolled) redirect(`/cursurile-mele/${course.slug}`)

  const price = formatMdl(course.priceMdl)

  return (
    <CheckoutShell eyebrow="Comandă" title="Finalizează comanda">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Link
            href={`/cursuri/${course.slug}`}
            className="inline-flex items-center gap-2 text-[13px] text-stone transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Înapoi la curs
          </Link>

          <dl className="mt-6 divide-y divide-champagne/20 border-y border-champagne/20 text-[14px]">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-stone">Contul</dt>
              <dd className="min-w-0 truncate text-ink">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-stone">Total de plată</dt>
              <dd className="font-mono text-ink">{price}</dd>
            </div>
          </dl>

          {isTestPaymentMode() && (
            <p
              role="note"
              className="mt-6 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-[13px] text-amber-900"
            >
              Mod de test: plata se simulează local, fără bancă și fără bani reali.
            </p>
          )}

          <div className="mt-6">
            <CheckoutForm slug={course.slug} price={price} />
          </div>
        </div>

        <aside aria-label="Rezumatul comenzii" className="row-start-1 lg:col-span-5 lg:col-start-8 lg:row-start-auto">
          <div className="lg:sticky lg:top-28">
            <OrderSummary
              title={course.title}
              coverImage={course.coverImage}
              coverAlt={course.coverAlt}
              price={price}
              details={
                <span className="flex flex-wrap gap-x-4">
                  <span>{levelLabel(course.level)}</span>
                  <span>{lessonsLabel(course.lessons.length)}</span>
                  <span>{formatDuration(course.totalSeconds)}</span>
                </span>
              }
            />
          </div>
        </aside>
      </div>
    </CheckoutShell>
  )
}
