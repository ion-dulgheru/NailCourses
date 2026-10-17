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
      <div className="mx-auto max-w-[560px]">
        <Link
          href={`/cursuri/${course.slug}`}
          className="inline-flex items-center gap-2 text-[13px] text-stone transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Înapoi la curs
        </Link>

        <div className="mt-6">
          <OrderSummary
            title={course.title}
            coverImage={course.coverImage}
            coverAlt={course.coverAlt}
            price={price}
            details={[levelLabel(course.level), lessonsLabel(course.lessons.length), formatDuration(course.totalSeconds)].join(' · ')}
          />
        </div>

        <dl className="mt-6 divide-y divide-line border-y border-line text-[14px]">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-stone">Contul</dt>
            <dd className="min-w-0 truncate text-ink">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-stone">Total de plată</dt>
            <dd className="font-medium text-ink">{price}</dd>
          </div>
        </dl>

        {isTestPaymentMode() && (
          <p role="note" className="mt-6 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            Mod de test: plata se simulează local, fără bancă și fără bani reali.
          </p>
        )}

        <div className="mt-6">
          <CheckoutForm slug={course.slug} price={price} />
        </div>
      </div>
    </CheckoutShell>
  )
}
