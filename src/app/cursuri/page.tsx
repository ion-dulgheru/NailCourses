import type { Metadata } from 'next'
import Link from 'next/link'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { container } from '@/components/home/primitives'
import { CourseIndex } from '@/components/courses/course-index'
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
        <section className="bg-ink pt-32 pb-14 text-ivory lg:pt-44 lg:pb-20">
          <div className={`${container} grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8`}>
            <h1 className="font-display text-[48px] leading-[0.98] font-light tracking-[-0.015em] sm:text-[62px] lg:col-span-7 lg:text-[76px]">
              Cursurile <em className="text-champagne italic">noastre</em>
            </h1>
            <p className="max-w-[30rem] text-[15px] leading-[1.65] text-ivory/65 sm:text-[16px] lg:col-span-5">
              Alege nivelul potrivit și învață în ritmul tău, de pe telefon sau calculator, cu
              lecții video explicate pas cu pas.
            </p>
          </div>
        </section>

        <section className="pt-10 pb-16 lg:pt-14 lg:pb-28">
          <div className={container}>
            <nav aria-label="Filtrează după nivel">
              <ul className="flex flex-wrap gap-x-7 gap-y-2">
                {filters.map((f) => {
                  const active = f.param === undefined ? !level : parseLevel(f.param) === level
                  return (
                    <li key={f.label}>
                      <Link
                        href={f.param ? `/cursuri?nivel=${f.param}` : '/cursuri'}
                        aria-current={active ? 'page' : undefined}
                        scroll={false}
                        className={cn(
                          'inline-flex h-10 items-center border-b text-[15px] transition-colors',
                          active
                            ? 'border-champagne text-ink'
                            : 'border-transparent text-stone hover:text-ink',
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
              <div className="mt-8 lg:mt-10">
                <CourseIndex courses={courses} wide />
              </div>
            ) : (
              <div className="mt-8 max-w-md border-t border-champagne/20 pt-10">
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
