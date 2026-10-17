import Image from 'next/image'
import Link from 'next/link'
import { ButtonLink } from '@/components/home/primitives'
import {
  formatDuration,
  formatMdl,
  lessonsLabel,
  levelLabel,
  type CourseCardData,
} from '@/lib/courses'

export function CourseCard({ course }: { course: CourseCardData }) {
  const href = `/cursuri/${course.slug}`

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-[11/10] overflow-hidden bg-sand">
        <Image
          src={course.coverImage}
          alt={course.coverAlt}
          fill
          sizes="(min-width: 1200px) 370px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 bg-ink/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-champagne-light backdrop-blur-sm">
          {levelLabel(course.level)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-bronze">
          {course.category}
        </p>
        <h3 className="mt-1.5 font-display text-[26px] leading-tight text-ink">
          <Link href={href} className="transition-colors hover:text-bronze">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-stone">{course.shortDescription}</p>

        <p className="mt-4 text-[13px] text-stone">
          {lessonsLabel(course.lessonCount)}
          <span aria-hidden="true" className="mx-2 text-line">
            •
          </span>
          {formatDuration(course.totalSeconds)}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-line/60 pt-5">
          <p className="font-display text-[24px] text-ink">{formatMdl(course.priceMdl)}</p>
          <ButtonLink href={href} className="h-11 px-6">
            Vezi cursul
            <span className="sr-only"> {course.title}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
