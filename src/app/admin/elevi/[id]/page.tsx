import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { revokeAccess } from '@/lib/actions/admin.actions'
import { AdminCard, AdminPageHeader, ConfirmButton } from '@/components/admin/ui'
import { adminButton } from '@/components/admin/styles'
import { GrantAccessForm } from '@/components/admin/grant-access-form'
import { RefundButton } from '@/components/admin/refund-button'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatMdl } from '@/lib/course-format'

type Props = { params: Promise<{ id: string }> }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })

async function getStudent(id: string) {
  if (!UUID.test(id)) return null
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      role: true,
      createdAt: true,
      enrollments: {
        orderBy: { grantedAt: 'desc' },
        include: {
          course: {
            select: { id: true, title: true, slug: true, lessons: { select: { id: true } } },
          },
        },
      },
      lessonProgress: { select: { lessonId: true } },
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { course: { select: { title: true } } },
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const student = await getStudent((await params).id)
  return { title: student ? [student.surname, student.name].join(' ') : 'Elev' }
}

export default async function StudentPage({ params }: Props) {
  const { id } = await params
  await requireAdminPage(`/admin/elevi/${id}`)

  const student = await getStudent(id)
  if (!student) notFound()

  const enrolledIds = new Set(student.enrollments.map((e) => e.course.id))
  const completed = new Set(student.lessonProgress.map((p) => p.lessonId))
  const available = await prisma.course.findMany({
    where: { id: { notIn: [...enrolledIds] } },
    orderBy: [{ status: 'desc' }, { position: 'asc' }],
    select: { id: true, title: true, status: true },
  })

  const fullName = [student.surname, student.name].filter(Boolean).join(' ')

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={
          <Link href="/admin/elevi" className="hover:text-ink">
            ← Elevi
          </Link>
        }
        title={fullName}
        description={
          <>
            {student.email} · înregistrat pe {dateFormat.format(student.createdAt)}
            {student.role === 'admin' && ' · Admin'}
          </>
        }
      />

      <AdminCard title="Acordă acces la un curs" description="Elevul vede cursul în „Cursurile mele” imediat după ce acorzi accesul.">
        {/* key: formularul (și mesajul lui) se resetează după fiecare schimbare de acces */}
        <GrantAccessForm key={student.enrollments.length} userId={student.id} courses={available} />
      </AdminCard>

      <AdminCard title="Cursuri cu acces">
        {student.enrollments.length === 0 ? (
          <p className="text-[14px] text-stone">Elevul nu are încă acces la niciun curs.</p>
        ) : (
          <ul className="-my-4 divide-y divide-champagne/20/70">
            {student.enrollments.map((e) => {
              const total = e.course.lessons.length
              const done = e.course.lessons.filter((l) => completed.has(l.id)).length
              const percent = total ? Math.round((done / total) * 100) : 0

              return (
                <li key={e.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/cursuri/${e.course.id}`} className="font-display text-[20px] text-ink hover:text-bronze">
                      {e.course.title}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-stone">
                      {e.source === 'manual' ? 'Acordat manual' : 'Plată'} pe {dateFormat.format(e.grantedAt)}
                    </p>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div
                        className="h-1.5 w-40 overflow-hidden bg-sand"
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progres ${e.course.title}`}
                      >
                        <div className="h-full bg-champagne" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-[12px] text-stone">
                        {done} din {total} lecții
                      </span>
                    </div>
                  </div>
                  <ConfirmButton
                    action={revokeAccess.bind(null, e.id)}
                    label="Retrage accesul"
                    confirmLabel="Da, retrage"
                    className={adminButton.danger}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </AdminCard>

      <AdminCard title="Comenzi" description="Plățile elevului, cu starea lor la bancă.">
        {student.orders.length === 0 ? (
          <p className="text-[14px] text-stone">Elevul nu are nicio comandă.</p>
        ) : (
          <ul className="-my-4 divide-y divide-champagne/20/70">
            {student.orders.map((o) => (
              <li key={o.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] text-ink">{o.course.title}</p>
                  <p className="mt-0.5 text-[12px] text-stone">
                    {dateFormat.format(o.createdAt)}
                    {o.maibTransactionId && (
                      <>
                        {' · '}
                        <span className="font-mono">{o.maibTransactionId}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <span className="font-mono text-[14px] text-ink">{formatMdl(o.amountMdl)}</span>
                  <OrderStatusBadge status={o.status} />
                  {o.status === 'platita' && <RefundButton orderId={o.id} />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  )
}
