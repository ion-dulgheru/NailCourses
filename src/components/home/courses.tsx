import Link from 'next/link'
import { SectionTitle, container } from './primitives'
import { CourseIndex } from '@/components/courses/course-index'
import { getPublishedCourses } from '@/lib/courses'

export async function Courses() {
  const courses = await getPublishedCourses({ take: 3 })
  if (courses.length === 0) return null

  return (
    <section id="cursuri" className="scroll-mt-4 bg-ivory py-16 lg:py-28">
      <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionTitle>
              Cursurile, <em>pas cu pas</em>
            </SectionTitle>
            <p className="mt-5 max-w-[24rem] text-[15px] leading-[1.65] text-stone lg:text-[16px]">
              Începi cu bazele dacă n-ai mai lucrat, sau sari direct la nivelul tău. Fiecare curs se
              cumpără separat.
            </p>
            <Link
              href="/cursuri"
              className="mt-6 inline-block text-[14px] text-ink underline decoration-champagne/50 underline-offset-[6px] transition-colors hover:decoration-bronze"
            >
              Vezi toate cursurile
            </Link>
          </div>
        </div>

        <div className="lg:col-span-8">
          <CourseIndex courses={courses} />
        </div>
      </div>
    </section>
  )
}
