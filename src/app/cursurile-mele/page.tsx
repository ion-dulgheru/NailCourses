import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { Badge, ButtonLink, container } from '@/components/home/primitives'
import { ProgressBar } from '@/components/student/progress-bar'
import { getMyCourses, requireStudent } from '@/lib/student'

export const metadata: Metadata = {
  title: 'Cursurile mele — GJ Nail Academy',
  robots: { index: false },
}

export default async function MyCoursesPage() {
  const user = await requireStudent('/cursurile-mele')
  const courses = await getMyCourses(user.id)

  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-32 pb-12 text-ivory lg:pt-40 lg:pb-16">
          <div className={container}>
            <p className="text-[14px] text-champagne-light/80">
              Bună, {user.surname || user.name}
            </p>
            <h1 className="mt-4 font-display text-[44px] leading-[1] font-light tracking-[-0.015em] sm:text-[56px]">
              Cursurile mele
            </h1>
            <p className="mt-4 max-w-[32rem] text-[15px] leading-[1.65] text-ivory/70">
              Continuă de unde ai rămas. Progresul se salvează automat pe orice dispozitiv.
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className={container}>
            {courses.length === 0 ? (
              <div className="max-w-lg border-t border-champagne/20 pt-10">
                <p className="font-display text-[30px] leading-tight text-ink">Încă nu ai niciun curs</p>
                <p className="mt-3 text-[15px] leading-[1.6] text-stone">
                  După ce primești acces la un curs, îl găsești aici și îl poți urmări oricând.
                </p>
                <ButtonLink href="/cursuri" className="mt-7">
                  Vezi cursurile
                </ButtonLink>
              </div>
            ) : (
              <ul className="border-b border-champagne/20">
                {courses.map((course) => {
                  const { progress } = course
                  const hasLessons = progress.total > 0
                  const cta = progress.finished ? 'Revezi cursul' : progress.done > 0 ? 'Continuă' : 'Începe cursul'
                  const continueHref = `/cursurile-mele/${course.slug}/${progress.nextLessonSlug}`

                  return (
                    <li
                      key={course.id}
                      className="grid grid-cols-1 gap-5 border-t border-champagne/20 py-8 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[240px_minmax(0,1fr)_auto] lg:items-center lg:gap-10"
                    >
                      <Link
                        href={`/cursurile-mele/${course.slug}`}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="relative block aspect-[16/10] overflow-hidden bg-sand sm:aspect-[4/3]"
                      >
                        <Image
                          src={course.coverImage}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 240px, (min-width: 640px) 200px, 100vw"
                          className="object-cover"
                        />
                      </Link>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          {progress.finished && <Badge>Finalizat</Badge>}
                          {course.category && <span className="text-[13px] text-stone">{course.category}</span>}
                        </div>
                        <h2 className="mt-2 font-display text-[30px] leading-[1.05] text-ink lg:text-[34px]">
                          <Link href={`/cursurile-mele/${course.slug}`} className="transition-colors hover:text-bronze">
                            {course.title}
                          </Link>
                        </h2>
                        <ProgressBar
                          done={progress.done}
                          total={progress.total}
                          label={`Progres ${course.title}`}
                          className="mt-5 max-w-md"
                        />
                      </div>

                      <div className="sm:col-start-2 lg:col-start-3">
                        {hasLessons ? (
                          <ButtonLink
                            href={continueHref}
                            variant={progress.finished ? 'outline-dark' : 'gold'}
                          >
                            {cta}
                          </ButtonLink>
                        ) : (
                          <p className="text-[13px] text-stone">Lecțiile vor fi disponibile în curând.</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}
