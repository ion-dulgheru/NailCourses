import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { Badge, ButtonLink } from './primitives'
import {
  formatDuration,
  formatMdl,
  getPublishedCourse,
  getPublishedCourses,
  lessonsLabel,
} from '@/lib/courses'

// Câte lecții din programă apar în previzualizarea din dreapta
const PREVIEW_LESSONS = 4

export async function Hero() {
  const [first] = await getPublishedCourses({ take: 1 })
  const course = first ? await getPublishedCourse(first.slug) : null
  const freeLesson = course?.lessons.find((l) => l.isFreePreview)

  return (
    <section className="bg-ink text-ivory">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-14 px-5 pt-28 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pt-40 lg:pb-28">
        <div className="lg:col-span-6 lg:self-center">
          <h1 className="font-display text-[48px] leading-[0.98] font-light tracking-[-0.015em] sm:text-[66px] lg:text-[82px]">
            Stăpânește arta unghiilor <em className="text-champagne italic">impecabile</em>
          </h1>

          <p className="mt-7 max-w-[30rem] text-[16px] leading-[1.65] text-ivory/70 lg:text-[18px]">
            Cursuri video de manichiură, explicate pas cu pas de fondatoarea GJ Nail Studio. Înveți de
            pe telefon sau calculator, în ritmul tău, și primești certificat la final.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href="#cursuri">Descoperă cursurile</ButtonLink>
            {course && (
              <Link
                href={`/cursuri/${course.slug}`}
                className="text-[14px] text-ivory/80 underline decoration-champagne/40 underline-offset-[6px] transition-colors hover:text-ivory hover:decoration-champagne"
              >
                {freeLesson ? 'Vezi lecția gratuită' : 'Vezi programa'}
              </Link>
            )}
          </div>
        </div>

        {/* Previzualizare: primul curs, cu începutul programei — ce primești, nu o promisiune */}
        <div className="lg:col-span-5 lg:col-start-8">
          <figure className="border border-champagne/20 bg-ink-soft">
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src="/images/hero-hands-face.jpg"
                alt="Femeie cu manichiură nude, cu mâinile lângă față"
                fill
                preload
                sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[50%_35%]"
              />
              {freeLesson && (
                <span className="absolute bottom-4 left-4 flex items-center gap-2.5">
                  <span className="flex size-10 items-center justify-center rounded-full bg-ivory text-ink">
                    <Play className="ml-0.5 size-4 fill-current" strokeWidth={0} aria-hidden="true" />
                  </span>
                  <Badge>Lecție gratuită</Badge>
                </span>
              )}
            </div>

            {course && (
              <figcaption className="px-5 pt-5 pb-2 sm:px-6">
                <p className="font-display text-[26px] leading-tight">{course.title}</p>

                <ol className="mt-4">
                  {course.lessons.slice(0, PREVIEW_LESSONS).map((lesson, i) => (
                    <li
                      key={lesson.id}
                      className="flex items-baseline gap-4 border-t border-champagne/15 py-3 text-[14px]"
                    >
                      <span className="font-mono text-[12px] text-champagne/80">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1 text-ivory/85 sm:truncate">{lesson.title}</span>
                      <span className="font-mono text-[12px] text-ivory/50">
                        {formatDuration(lesson.durationSeconds)}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="flex items-baseline justify-between gap-4 border-t border-champagne/15 py-4 font-mono text-[12px] text-ivory/50">
                  <span>
                    {lessonsLabel(course.lessons.length)}, {formatDuration(course.totalSeconds)}
                  </span>
                  <span className="text-[15px] text-ivory">{formatMdl(course.priceMdl)}</span>
                </div>
              </figcaption>
            )}
          </figure>
        </div>
      </div>
    </section>
  )
}
