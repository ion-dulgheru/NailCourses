import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/home/primitives'
import { cn } from '@/lib/utils'
import {
  formatDuration,
  formatMdl,
  lessonsLabel,
  levelLabel,
  type CourseCardData,
} from '@/lib/courses'

// Lista editorială a cursurilor. Cursurile vin în ordinea din admin (de la începător la avansat),
// deci numerotarea arată traseul recomandat. `wide`: pe toată lățimea, prețul trece în coloana din dreapta.
export function CourseIndex({ courses, wide = false }: { courses: CourseCardData[]; wide?: boolean }) {
  return (
    <ol className="border-b border-champagne/20">
      {courses.map((course, i) => {
        const href = `/cursuri/${course.slug}`
        return (
          <li
            key={course.id}
            className={cn(
              'grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-5 border-t border-champagne/20 py-8 sm:grid-cols-[3rem_minmax(0,220px)_1fr] sm:gap-x-6 lg:py-10',
              wide && 'lg:grid-cols-[4rem_260px_1fr_auto] lg:gap-x-10',
            )}
          >
            <span className="pt-1 font-mono text-[13px] text-bronze">
              {String(i + 1).padStart(2, '0')}
            </span>

            <Link
              href={href}
              tabIndex={-1}
              aria-hidden="true"
              className="relative col-start-2 row-start-2 block aspect-[16/10] overflow-hidden bg-sand sm:row-start-1 sm:aspect-[4/3]"
            >
              <Image
                src={course.coverImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 90vw"
                className="object-cover"
              />
            </Link>

            <div className="col-start-2 row-start-1 sm:col-start-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Badge>{levelLabel(course.level)}</Badge>
                <span className="text-[13px] text-stone">{course.category}</span>
              </div>
              <h3 className="mt-3 font-display text-[30px] leading-[1.05] text-ink lg:text-[38px]">
                <Link href={href} className="transition-colors hover:text-bronze">
                  {course.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-[34rem] text-[15px] leading-[1.6] text-stone">
                {course.shortDescription}
              </p>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[12px] text-stone">
                <span>{lessonsLabel(course.lessonCount)}</span>
                <span>{formatDuration(course.totalSeconds)}</span>
              </p>
            </div>

            <div
              className={cn(
                'col-start-2 flex items-center justify-between gap-6 sm:col-start-3',
                wide && 'lg:col-start-4 lg:row-start-1 lg:flex-col lg:items-end lg:justify-start lg:gap-4',
              )}
            >
              <p className={cn('font-mono text-[18px] text-ink', wide && 'lg:pt-1')}>
                {formatMdl(course.priceMdl)}
              </p>
              <Link
                href={href}
                className="text-[14px] text-ink underline decoration-champagne/50 underline-offset-[6px] transition-colors hover:decoration-bronze"
              >
                Vezi cursul<span className="sr-only"> {course.title}</span>
              </Link>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
