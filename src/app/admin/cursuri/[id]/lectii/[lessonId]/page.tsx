import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { formatDuration } from '@/lib/course-format'
import { isStorageConfigured } from '@/lib/storage'
import { AdminPageHeader } from '@/components/admin/ui'
import { adminButton } from '@/components/admin/styles'
import { BlocksEditor } from '@/components/admin/blocks-editor'

type Props = { params: Promise<{ id: string; lessonId: string }> }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getLesson(courseId: string, lessonId: string) {
  if (!UUID.test(courseId) || !UUID.test(lessonId)) return null
  return prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
    include: {
      course: {
        select: { id: true, title: true, lessons: { orderBy: { position: 'asc' }, select: { id: true, title: true } } },
      },
      blocks: { orderBy: { position: 'asc' } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lessonId } = await params
  const lesson = await getLesson(id, lessonId)
  return { title: lesson ? `${lesson.title} — conținut` : 'Lecție' }
}

export default async function LessonContentPage({ params }: Props) {
  const { id, lessonId } = await params
  await requireAdminPage(`/admin/cursuri/${id}/lectii/${lessonId}`)

  const lesson = await getLesson(id, lessonId)
  if (!lesson) notFound()

  const siblings = lesson.course.lessons
  const index = siblings.findIndex((l) => l.id === lesson.id)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const lessonHref = (lid: string) => `/admin/cursuri/${id}/lectii/${lid}`

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={
          <Link href={`/admin/cursuri/${id}`} className="hover:text-ink">
            ← {lesson.course.title}
          </Link>
        }
        title={lesson.title}
        description={`Lecția ${index + 1} din ${siblings.length} · ${formatDuration(lesson.durationSeconds)}${lesson.isFreePreview ? ' · probă gratuită' : ''}`}
      />

      {!isStorageConfigured() && (
        <p role="note" className="border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          Spațiul de stocare video (Cloudflare R2) nu este încă conectat. Poți adăuga deja blocurile video cu numele
          fișierelor; elevele vor vedea „Videoclipul va fi disponibil în curând” până la conectare. Linkurile YouTube
          funcționează imediat.
        </p>
      )}

      <BlocksEditor
        lessonId={lesson.id}
        blocks={lesson.blocks.map((b) => ({ id: b.id, type: b.type, text: b.text, videoKey: b.videoKey }))}
      />

      <nav aria-label="Alte lecții" className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {prev ? (
          <Link href={lessonHref(prev.id)} className={adminButton.secondary}>
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
            <span className="max-w-[16rem] truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={lessonHref(next.id)} className={adminButton.secondary}>
            <span className="max-w-[16rem] truncate">{next.title}</span>
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  )
}
