import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { ButtonLink, container } from '@/components/home/primitives'
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
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-champagne-light">
              Bună, {user.surname || user.name}
            </p>
            <h1 className="mt-4 pb-1 font-display text-[44px] leading-[1.05] font-normal text-gold-metal sm:text-[56px]">
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
              <div className="mx-auto max-w-lg border border-line px-6 py-14 text-center">
                <p className="font-display text-[30px] leading-tight text-ink">Încă nu ai niciun curs</p>
                <p className="mt-3 text-[15px] leading-[1.6] text-stone">
                  După ce primești acces la un curs, îl găsești aici și îl poți urmări oricând.
                </p>
                <ButtonLink href="/cursuri" className="mt-7">
                  Vezi cursurile
                </ButtonLink>
              </div>
            ) : (
              <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                  const { progress } = course
                  const hasLessons = progress.total > 0
                  const cta = progress.finished ? 'Revezi cursul' : progress.done > 0 ? 'Continuă' : 'Începe cursul'
                  const continueHref = `/cursurile-mele/${course.slug}/${progress.nextLessonSlug}`

                  return (
                    <li key={course.id}>
                      <article className="group flex h-full flex-col">
                        <Link
                          href={`/cursurile-mele/${course.slug}`}
                          className="relative block aspect-[11/10] overflow-hidden bg-sand"
                        >
                          <Image
                            src={course.coverImage}
                            alt={course.coverAlt}
                            fill
                            sizes="(min-width: 1200px) 370px, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                          {progress.finished && (
                            <span className="absolute top-3 left-3 bg-ink/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-champagne-light">
                              Finalizat
                            </span>
                          )}
                        </Link>

                        <div className="flex flex-1 flex-col pt-5">
                          {course.category && (
                            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-bronze">
                              {course.category}
                            </p>
                          )}
                          <h2 className="mt-1.5 font-display text-[26px] leading-tight text-ink">
                            <Link href={`/cursurile-mele/${course.slug}`} className="hover:text-bronze">
                              {course.title}
                            </Link>
                          </h2>

                          <ProgressBar
                            done={progress.done}
                            total={progress.total}
                            label={`Progres ${course.title}`}
                            className="mt-auto pt-5"
                          />

                          {hasLessons ? (
                            <ButtonLink href={continueHref} className="mt-5 self-start">
                              {cta}
                            </ButtonLink>
                          ) : (
                            <p className="mt-5 text-[13px] text-stone">Lecțiile vor fi disponibile în curând.</p>
                          )}
                        </div>
                      </article>
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
