import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { auth } from '@/auth'
import { Wordmark } from '@/components/home/primitives'
import { ProgressBar } from '@/components/student/progress-bar'
import { CompleteButton } from '@/components/student/complete-button'
import { LessonBlock } from '@/components/student/lesson-blocks'
import { prisma } from '@/lib/db'
import { formatDuration } from '@/lib/course-format'
import { getMyCourse, requireStudent } from '@/lib/student'
import { cn } from '@/lib/utils'

type Props = { params: Promise<{ slug: string; lectie: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lectie } = await params
  const session = await auth()
  const data = session?.user?.id ? await getMyCourse(session.user.id, slug) : null
  const lesson = data?.course.lessons.find((l) => l.slug === lectie)
  return {
    title: lesson ? `${lesson.title} — ${data!.course.title}` : 'Lecție — GJ Nail Academy',
    robots: { index: false },
  }
}

export default async function LessonPage({ params }: Props) {
  const { slug, lectie } = await params
  const user = await requireStudent(`/cursurile-mele/${slug}/${lectie}`)

  const data = await getMyCourse(user.id, slug)
  if (!data) notFound()

  const { course, completed, progress } = data
  const index = course.lessons.findIndex((l) => l.slug === lectie)
  if (index === -1) notFound()

  const lesson = course.lessons[index]
  const prev = course.lessons[index - 1]
  const next = course.lessons[index + 1]
  const lessonHref = (s: string) => `/cursurile-mele/${course.slug}/${s}`

  const blocks = await prisma.lessonBlock.findMany({
    where: { lessonId: lesson.id },
    orderBy: { position: 'asc' },
    select: { id: true, type: true, text: true, videoKey: true },
  })
  // Dacă lecția începe cu un video, el stă sus, ca înainte; restul blocurilor urmează sub titlu.
  const [lead, rest] = blocks[0]?.type === 'video' ? [blocks[0], blocks.slice(1)] : [null, blocks]

  return (
    <div className="min-h-svh bg-ink text-ivory">
      {/* Bară compactă: mod de învățare, fără meniul complet al site-ului */}
      <header className="sticky top-0 z-30 border-b border-champagne/15 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:h-16 lg:px-10">
          <div className="hidden sm:block">
            <Wordmark />
          </div>
          <span aria-hidden="true" className="hidden h-5 w-px bg-champagne/20 sm:block" />
          <Link
            href={`/cursurile-mele/${course.slug}`}
            className="flex min-w-0 items-center gap-2 text-[13px] text-ivory/70 transition-colors hover:text-champagne-light"
          >
            <ArrowLeft className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span className="truncate">{course.title}</span>
          </Link>
          <span className="ml-auto shrink-0 font-mono text-[12px] text-ivory/50">
            {progress.done}/{progress.total} terminate
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 px-0 pb-12 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
          {lead && <LessonBlock block={lead} watermark={user.email} lessonTitle={lesson.title} />}

          <div className="px-5 pt-8 sm:px-0">
            <p className="flex gap-6 font-mono text-[12px] text-champagne-light/80">
              <span>
                Lecția {String(index + 1).padStart(2, '0')}/{String(course.lessons.length).padStart(2, '0')}
              </span>
              <span>{formatDuration(lesson.durationSeconds)}</span>
            </p>
            <h1 className="mt-3 font-display text-[36px] leading-[1.05] font-light text-ivory sm:text-[48px]">{lesson.title}</h1>
            {lesson.description && (
              <p className="mt-4 max-w-[46rem] text-[15px] leading-[1.7] text-ivory/70">{lesson.description}</p>
            )}

            {rest.length > 0 && (
              <div className="-mx-5 mt-10 space-y-8 sm:mx-0 [&>:not(figure)]:px-5 sm:[&>:not(figure)]:px-0">
                {rest.map((block) => (
                  <LessonBlock key={block.id} block={block} watermark={user.email} lessonTitle={lesson.title} />
                ))}
              </div>
            )}

            {blocks.length === 0 && (
              <p className="mt-8 border border-champagne/15 px-5 py-6 text-[14px] text-ivory/55">
                Conținutul acestei lecții va fi disponibil în curând.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-4 border-t border-champagne/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <CompleteButton key={lesson.id} lessonId={lesson.id} completed={completed.has(lesson.id)} />

              <nav aria-label="Navigare între lecții" className="flex gap-3">
                {prev ? (
                  <Link
                    href={lessonHref(prev.slug)}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 border border-ivory/20 px-5 text-[13px] text-ivory/80 transition-colors hover:border-ivory/60 hover:text-ivory sm:flex-none"
                  >
                    <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    Anterioara
                  </Link>
                ) : null}
                {next ? (
                  <Link
                    href={lessonHref(next.slug)}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 border border-ivory/20 px-5 text-[13px] text-ivory transition-colors hover:border-champagne hover:text-champagne-light sm:flex-none"
                  >
                    Următoarea
                    <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href={`/cursurile-mele/${course.slug}`}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 border border-ivory/20 px-5 text-[13px] text-ivory transition-colors hover:border-champagne hover:text-champagne-light sm:flex-none"
                  >
                    Înapoi la curs
                  </Link>
                )}
              </nav>
            </div>

            {progress.finished && (
              <p className="mt-8 border border-champagne/20 px-4 py-3 text-[14px] text-ivory/85">
                Felicitări, ai terminat toate lecțiile cursului!{' '}
                <Link href={`/cursurile-mele/${course.slug}`} className="text-champagne-light underline underline-offset-4">
                  Vezi certificatul
                </Link>
              </p>
            )}
          </div>
        </main>

        <aside className="border-t border-champagne/15 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <div className="border-b border-champagne/15 px-5 py-5 sm:px-8 lg:px-6">
            <h2 className="font-display text-[22px] text-ivory">Lecțiile cursului</h2>
            <ProgressBar done={progress.done} total={progress.total} label="Progresul cursului" tone="dark" className="mt-3" />
          </div>
          <ol>
            {course.lessons.map((l, i) => {
              const current = l.id === lesson.id
              const done = completed.has(l.id)
              return (
                <li key={l.id}>
                  <Link
                    href={lessonHref(l.slug)}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex items-start gap-3 border-b border-champagne/15 px-5 py-3.5 transition-colors sm:px-8 lg:px-6',
                      current ? 'bg-ivory/[0.07]' : 'hover:bg-ivory/[0.04]',
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" strokeWidth={1.75} aria-label="Terminată" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-ivory/25" strokeWidth={1.5} aria-label="Neterminată" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-[14px] leading-snug', current ? 'text-ivory' : 'text-ivory/70')}>
                        {l.title}
                      </span>
                      <span className="mt-1 flex gap-3 font-mono text-[11px] text-ivory/40">
                        <span>{String(i + 1).padStart(2, '0')}</span>
                        <span>{formatDuration(l.durationSeconds)}</span>
                      </span>
                    </span>
                    {current && <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-champagne" />}
                  </Link>
                </li>
              )
            })}
          </ol>
        </aside>
      </div>
    </div>
  )
}
