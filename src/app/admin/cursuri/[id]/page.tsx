import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { listPublicImages } from '@/lib/images'
import { AdminCard, AdminPageHeader, StatusBadge } from '@/components/admin/ui'
import { adminButton } from '@/components/admin/styles'
import { CourseForm } from '@/components/admin/course-form'
import { LessonsManager } from '@/components/admin/lessons-manager'
import { CourseDangerZone } from '@/components/admin/course-danger-zone'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ creat?: string }>
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getCourse(id: string) {
  if (!UUID.test(id)) return null
  return prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { position: 'asc' },
        include: { blocks: { select: { type: true } } },
      },
      _count: { select: { enrollments: true } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).id)
  return { title: course ? course.title : 'Curs' }
}

export default async function EditCoursePage({ params, searchParams }: Props) {
  const { id } = await params
  await requireAdminPage(`/admin/cursuri/${id}`)

  const [course, images, { creat }] = await Promise.all([getCourse(id), listPublicImages(), searchParams])
  if (!course) notFound()

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={
          <Link href="/admin/cursuri" className="hover:text-ink">
            ← Cursuri
          </Link>
        }
        title={course.title}
        description={
          <span className="inline-flex flex-wrap items-center gap-3">
            <StatusBadge status={course.status} />
            <span>
              {course._count.enrollments} {course._count.enrollments === 1 ? 'elev are' : 'elevi au'} acces
            </span>
          </span>
        }
        actions={
          course.status === 'publicat' && (
            <Link href={`/cursuri/${course.slug}`} target="_blank" className={adminButton.secondary}>
              <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Vezi pe site
            </Link>
          )
        }
      />

      {creat && (
        <p role="status" className="border-l-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-900">
          Cursul a fost creat ca ciornă. Adaugă lecțiile mai jos, apoi publică-l.
        </p>
      )}

      <LessonsManager
        courseId={course.id}
        lessons={course.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          durationSeconds: l.durationSeconds,
          blockCount: l.blocks.length,
          videoCount: l.blocks.filter((b) => b.type === 'video').length,
          isFreePreview: l.isFreePreview,
        }))}
      />

      <CourseForm
        images={images}
        course={{
          id: course.id,
          title: course.title,
          slug: course.slug,
          category: course.category,
          shortDescription: course.shortDescription,
          longDescription: course.longDescription,
          level: course.level,
          priceMdl: course.priceMdl,
          coverImage: course.coverImage,
          coverAlt: course.coverAlt,
          whatYouLearn: course.whatYouLearn,
          forWho: course.forWho,
          materials: course.materials,
          status: course.status,
        }}
      />

      <AdminCard title="Zonă periculoasă" className="border-red-200">
        <CourseDangerZone courseId={course.id} hasStudents={course._count.enrollments > 0} />
      </AdminCard>
    </div>
  )
}
