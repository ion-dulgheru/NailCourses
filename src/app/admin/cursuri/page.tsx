import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { formatMdl, lessonsLabel, levelLabel } from '@/lib/courses'
import { AdminPageHeader, StatusBadge } from '@/components/admin/ui'
import { adminButton } from '@/components/admin/styles'

export const metadata: Metadata = { title: 'Cursuri' }

export default async function AdminCoursesPage() {
  await requireAdminPage('/admin/cursuri')

  const courses = await prisma.course.findMany({
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    include: { _count: { select: { lessons: true, enrollments: true } } },
  })

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Conținut"
        title="Cursuri"
        description="Cursurile „Ciornă” nu apar pe site. Publică un curs când are toate lecțiile."
        actions={
          <Link href="/admin/cursuri/nou" className={adminButton.primary}>
            Curs nou
          </Link>
        }
      />

      {courses.length === 0 ? (
        <div className="border border-dashed border-champagne/20 bg-ivory px-6 py-14 text-center">
          <p className="font-display text-[24px] text-ink">Încă nu există cursuri.</p>
          <Link href="/admin/cursuri/nou" className={`${adminButton.primary} mt-5`}>
            Creează primul curs
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/admin/cursuri/${course.id}`}
                className="group flex items-center gap-4 border border-champagne/20 bg-ivory p-3 pr-5 transition-colors hover:border-champagne sm:gap-5"
              >
                <div className="relative size-16 shrink-0 overflow-hidden bg-sand sm:size-20">
                  <Image src={course.coverImage} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="truncate font-display text-[22px] leading-tight text-ink group-hover:text-bronze">
                      {course.title}
                    </p>
                    <StatusBadge status={course.status} />
                  </div>
                  <p className="mt-1 text-[13px] text-stone">
                    {levelLabel(course.level)} · {lessonsLabel(course._count.lessons)} · {course._count.enrollments}{' '}
                    {course._count.enrollments === 1 ? 'elev' : 'elevi'}
                  </p>
                </div>
                <p className="hidden shrink-0 font-mono text-[15px] text-ink sm:block">
                  {formatMdl(course.priceMdl)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
