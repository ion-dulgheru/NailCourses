import type { Metadata } from 'next'
import Link from 'next/link'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { container } from '@/components/home/primitives'
import { CourseCard } from '@/components/courses/course-card'
import { LEVELS, getPublishedCourses, parseLevel } from '@/lib/courses'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Cursuri de manichiură — GJ Nail Academy',
  description:
    'Toate cursurile online de manichiură: de la bazele tehnicii până la nail art avansat. Prețuri în MDL, acces de pe telefon sau calculator.',
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>
}) {
  const level = parseLevel((await searchParams).nivel)
  const courses = await getPublishedCourses({ level })

  const filters = [{ label: 'Toate', param: undefined }, ...LEVELS]

  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-32 pb-14 text-center text-ivory lg:pt-40 lg:pb-20">
          <div className={container}>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-champagne-light">
              Catalog
            </p>
            <h1 className="mt-4 pb-1 font-display text-[44px] leading-[1.05] font-normal text-gold-metal sm:text-[56px] lg:text-[64px]">
              Cursurile noastre
            </h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-[15px] leading-[1.65] text-ivory/75 sm:text-[16px]">
              Alege nivelul potrivit și învață în ritmul tău, de pe telefon sau calculator, cu
              lecții video explicate pas cu pas.
            </p>
          </div>
        </section>

        <section className="pt-10 pb-16 lg:pt-14 lg:pb-24">
          <div className={container}>
            <nav aria-label="Filtrează după nivel" className="flex justify-center">
              <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {filters.map((f) => {
                  const active = f.param === undefined ? !level : parseLevel(f.param) === level
                  return (
                    <li key={f.label}>
                      <Link
                        href={f.param ? `/cursuri?nivel=${f.param}` : '/cursuri'}
                        aria-current={active ? 'page' : undefined}
                        scroll={false}
                        className={cn(
                          'inline-flex h-10 items-center border px-5 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors',
                          active
                            ? 'border-ink bg-ink text-ivory'
                            : 'border-line text-stone hover:border-ink hover:text-ink',
                        )}
                      >
                        {f.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {courses.length > 0 ? (
              <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
                {courses.map((course) => (
                  <li key={course.id}>
                    <CourseCard course={course} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mx-auto mt-14 max-w-md text-center">
                <p className="font-display text-[26px] text-ink">Încă nu avem cursuri la acest nivel.</p>
                <p className="mt-3 text-[15px] text-stone">
                  Revino curând sau{' '}
                  <Link href="/cursuri" className="text-bronze underline underline-offset-4 hover:text-ink">
                    vezi toate cursurile
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}
