import { ButtonLink, SectionTitle, container } from './primitives'
import { CourseCard } from '@/components/courses/course-card'
import { getPublishedCourses } from '@/lib/courses'

export async function Courses() {
  const courses = await getPublishedCourses({ take: 3 })
  if (courses.length === 0) return null

  return (
    <section id="cursuri" className="scroll-mt-4 bg-ivory pt-14 pb-16 lg:pt-20 lg:pb-24">
      <div className={container}>
        <SectionTitle>Cursuri recomandate</SectionTitle>

        {/* Pe telefon: carduri întregi care se glisează lateral (următorul se vede pe margine).
            De la lg: grilă pe 3 coloane. */}
        <ul className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {courses.map((course) => (
            <li key={course.id} className="w-[84%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
              <CourseCard course={course} />
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center lg:mt-14">
          <ButtonLink href="/cursuri" variant="outline-dark" className="px-10">
            Vezi toate cursurile
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
