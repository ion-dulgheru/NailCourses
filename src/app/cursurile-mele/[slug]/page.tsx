import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Award, CheckCircle2, Circle, Lock } from 'lucide-react'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { ButtonLink, container } from '@/components/home/primitives'
import { ProgressBar } from '@/components/student/progress-bar'
import { formatDuration, lessonsLabel } from '@/lib/course-format'
import { getMyCourse, requireStudent } from '@/lib/student'
import { issueCertificateIfComplete } from '@/lib/certificates'
import { auth } from '@/auth'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await auth()
  const data = session?.user?.id ? await getMyCourse(session.user.id, (await params).slug) : null
  return {
    title: data ? `${data.course.title} — Cursurile mele` : 'Cursurile mele — GJ Nail Academy',
    robots: { index: false },
  }
}

export default async function MyCoursePage({ params }: Props) {
  const { slug } = await params
  const user = await requireStudent(`/cursurile-mele/${slug}`)

  // Fără înscriere → 404 (nu dezvăluim dacă există cursul).
  const data = await getMyCourse(user.id, slug)
  if (!data) notFound()

  const { course, completed, progress } = data
  const certificate = progress.finished ? await issueCertificateIfComplete(user.id, course.id) : null
  const totalSeconds = course.lessons.reduce((sum, l) => sum + l.durationSeconds, 0)
  const cta = progress.finished ? 'Revezi cursul' : progress.done > 0 ? 'Continuă cursul' : 'Începe cursul'

  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-28 pb-12 text-ivory lg:pt-36 lg:pb-16">
          <div className={container}>
            <nav aria-label="Breadcrumb" className="text-[12px] text-ivory/50">
              <Link href="/cursurile-mele" className="transition-colors hover:text-champagne-light">
                Cursurile mele
              </Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span className="text-ivory/80">{course.title}</span>
            </nav>

            <h1 className="mt-5 pb-1 font-display text-[40px] leading-[1.05] font-normal text-gold-metal sm:text-[52px]">
              {course.title}
            </h1>
            <p className="mt-3 text-[14px] text-ivory/60">
              {lessonsLabel(progress.total)} · {formatDuration(totalSeconds)}
            </p>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <ProgressBar
                done={progress.done}
                total={progress.total}
                label="Progresul tău la acest curs"
                tone="dark"
                className="w-full max-w-md"
              />
              {progress.nextLessonSlug && (
                <ButtonLink href={`/cursurile-mele/${course.slug}/${progress.nextLessonSlug}`} className="shrink-0">
                  {cta}
                </ButtonLink>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14`}>
            <div>
              <h2 className="font-display text-[28px] uppercase tracking-[0.03em] text-ink">Lecții</h2>
              {course.lessons.length === 0 ? (
                <p className="mt-6 text-[15px] text-stone">Lecțiile vor fi disponibile în curând.</p>
              ) : (
                <ol className="mt-6 border-t border-line">
                  {course.lessons.map((lesson, i) => {
                    const done = completed.has(lesson.id)
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/cursurile-mele/${course.slug}/${lesson.slug}`}
                          className="group flex items-center gap-4 border-b border-line py-4 transition-colors hover:bg-sand/60 sm:gap-5 sm:px-3"
                        >
                          {done ? (
                            <CheckCircle2 className="size-5 shrink-0 text-bronze" strokeWidth={1.5} aria-label="Terminată" />
                          ) : (
                            <Circle className="size-5 shrink-0 text-line" strokeWidth={1.5} aria-label="Neterminată" />
                          )}
                          <span className="w-7 shrink-0 font-display text-[20px] text-bronze">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={`flex-1 text-[15px] leading-snug ${done ? 'text-stone' : 'text-ink'} group-hover:text-bronze`}>
                            {lesson.title}
                          </span>
                          <span className="shrink-0 text-[13px] text-stone">{formatDuration(lesson.durationSeconds)}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>

            <aside className="h-fit border border-line p-6 lg:sticky lg:top-24">
              <Award className="size-8 text-bronze" strokeWidth={1} aria-hidden="true" />
              <h2 className="mt-4 font-display text-[24px] leading-tight text-ink">Certificat de absolvire</h2>
              {certificate ? (
                <>
                  <p className="mt-3 text-[14px] leading-[1.6] text-stone">
                    Felicitări, ai terminat toate lecțiile! Certificatul tău este gata.
                  </p>
                  <ButtonLink href={`/certificate/${certificate.code}`} className="mt-5 w-full">
                    Vezi certificatul
                  </ButtonLink>
                </>
              ) : (
                <p className="mt-3 flex gap-2 text-[14px] leading-[1.6] text-stone">
                  <Lock className="mt-1 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  Marchează toate lecțiile ca terminate ca să deblochezi certificatul.
                </p>
              )}
            </aside>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}
