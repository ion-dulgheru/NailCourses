import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Award, BarChart3, Check, Clock, Lock, PlayCircle } from 'lucide-react'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { Instructor } from '@/components/home/instructor'
import { ButtonLink, SectionTitle, container } from '@/components/home/primitives'
import {
  formatDuration,
  formatMdl,
  getPublishedCourse,
  lessonsLabel,
  levelLabel,
} from '@/lib/courses'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const course = await getPublishedCourse((await params).slug)
  if (!course) return { title: 'Curs negăsit — GJ Nail Academy' }

  return {
    title: `${course.title} — GJ Nail Academy`,
    description: course.shortDescription,
    openGraph: { images: [course.coverImage] },
  }
}

export default async function CoursePage({ params }: Params) {
  const course = await getPublishedCourse((await params).slug)
  if (!course) notFound()

  const buyHref = `/checkout/${course.slug}`
  const price = formatMdl(course.priceMdl)

  const facts = [
    { icon: BarChart3, label: 'Nivel', value: levelLabel(course.level) },
    { icon: PlayCircle, label: 'Lecții', value: lessonsLabel(course.lessons.length) },
    { icon: Clock, label: 'Durată', value: formatDuration(course.totalSeconds) },
    { icon: Award, label: 'La final', value: 'Certificat' },
  ]

  return (
    <div className="min-h-screen bg-ivory pb-20 lg:pb-0">
      <HomeHeader />

      <main>
        {/* 1. Antet */}
        <section className="bg-ink pt-24 pb-14 text-ivory lg:pt-36 lg:pb-24">
          <div className={`${container} grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16`}>
            <div className="order-2 lg:order-1">
              <nav aria-label="Breadcrumb" className="text-[12px] text-ivory/50">
                <Link href="/cursuri" className="transition-colors hover:text-champagne-light">
                  Cursuri
                </Link>
                <span aria-hidden="true" className="mx-2">/</span>
                <span className="text-ivory/80">{course.title}</span>
              </nav>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-champagne-light">
                {course.category}
              </p>
              <h1 className="mt-3 pb-1 font-display text-[44px] leading-[1.02] font-normal text-gold-metal sm:text-[56px] lg:text-[64px]">
                {course.title}
              </h1>
              <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.65] text-ivory/80">
                {course.shortDescription}
              </p>

              <dl className="mt-8 grid grid-cols-2 border-y border-ivory/10 sm:grid-cols-4">
                {facts.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={`py-4 ${i % 2 === 1 ? 'pl-4 sm:pl-0' : ''} ${i > 0 ? 'sm:border-l sm:border-ivory/10 sm:pl-4' : ''} ${i >= 2 ? 'border-t border-ivory/10 sm:border-t-0' : ''}`}
                  >
                    <dt className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ivory/50">
                      <Icon className="size-3.5 text-champagne" strokeWidth={1.5} aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-[15px] text-ivory">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                <p className="font-display text-[40px] leading-none text-ivory">{price}</p>
                <ButtonLink href={buyHref} className="h-[52px] px-10">
                  Cumpără cursul
                </ButtonLink>
              </div>
              <p className="mt-4 text-[12px] text-ivory/45">Plată securizată cu cardul. Acces imediat după plată.</p>
            </div>

            <div className="relative order-1 lg:order-2">
              <div aria-hidden="true" className="absolute -inset-3 hidden border border-champagne/30 lg:block" />
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft lg:aspect-[4/5]">
                <Image
                  src={course.coverImage}
                  alt={course.coverAlt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Ce vei învăța */}
        <section className="py-16 lg:py-24">
          <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20`}>
            <div>
              <SectionTitle className="text-left">Ce vei învăța</SectionTitle>
              {course.longDescription && (
                <p className="mt-6 text-[15px] leading-[1.75] text-stone">{course.longDescription}</p>
              )}
            </div>
            <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {course.whatYouLearn.map((item) => (
                <li key={item} className="flex gap-3 border-b border-line/50 pb-5 text-[15px] leading-[1.55] text-ink">
                  <Check className="mt-0.5 size-5 shrink-0 text-bronze" strokeWidth={1.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Programa */}
        <section className="bg-sand py-16 lg:py-24">
          <div className={`${container} max-w-[880px]`}>
            <SectionTitle>Programa cursului</SectionTitle>
            <p className="mt-4 text-center text-[14px] text-stone">
              {lessonsLabel(course.lessons.length)} · {formatDuration(course.totalSeconds)} de video
            </p>

            <ol className="mt-10 border-t border-line">
              {course.lessons.map((lesson, i) => (
                <li key={lesson.id} className="flex items-center gap-4 border-b border-line py-5 sm:gap-6">
                  <span className="w-7 shrink-0 font-display text-[22px] text-bronze">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-[15px] leading-snug text-ink sm:text-[16px]">
                    {lesson.title}
                    {lesson.isFreePreview && (
                      <span className="mt-1.5 block w-fit bg-ink px-2 py-0.5 sm:mt-0 sm:ml-3 sm:inline-block sm:align-middle text-[10px] font-medium uppercase tracking-[0.14em] text-champagne-light">
                        Probă gratuită
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-[13px] text-stone">{formatDuration(lesson.durationSeconds)}</span>
                  {!lesson.isFreePreview && (
                    <Lock className="size-4 shrink-0 text-stone/50" strokeWidth={1.5} aria-label="Disponibilă după cumpărare" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4–5. Pentru cine e / De ce ai nevoie */}
        <section className="py-16 lg:py-24">
          <div className={`${container} grid gap-6 md:grid-cols-2 lg:gap-8`}>
            {[
              { title: 'Pentru cine e', items: course.forWho },
              { title: 'De ce ai nevoie', items: course.materials },
            ]
              .filter((block) => block.items.length > 0)
              .map((block) => (
                <div key={block.title} className="border border-line p-7 sm:p-10">
                  <h2 className="font-display text-[28px] uppercase tracking-[0.03em] text-ink">{block.title}</h2>
                  <span aria-hidden="true" className="mt-4 block h-px w-12 bg-gold-metal" />
                  <ul className="mt-6 space-y-3.5">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-[1.55] text-stone">
                        <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-champagne" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>

        {/* 6. Instructoarea */}
        <Instructor />

        {/* 7–8. Certificat + rambursare */}
        <section className="bg-ink py-16 text-ivory lg:py-24">
          <div className={`${container} grid gap-12 md:grid-cols-2 md:gap-16`}>
            <div>
              <Award className="size-9 text-champagne" strokeWidth={1} aria-hidden="true" />
              <h2 className="mt-5 font-display text-[32px] leading-tight text-ivory">Certificat de absolvire</h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-ivory/70">
                După ce marchezi toate lecțiile ca terminate, descarci din cont un certificat PDF cu numele
                tău, titlul cursului, data finalizării și un cod unic.
              </p>
            </div>
            <div className="md:border-l md:border-ivory/10 md:pl-16">
              <h2 className="font-display text-[32px] leading-tight text-ivory">Rambursare</h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-ivory/70">
                Condițiile în care îți poți recupera banii sunt descrise în politica de rambursare.
                Citește-o înainte de cumpărare.
              </p>
              <Link
                href="/politica-de-rambursare"
                className="mt-5 inline-block text-[14px] text-champagne-light underline decoration-champagne/40 underline-offset-4 transition-colors hover:text-ivory"
              >
                Politica de rambursare
              </Link>
            </div>
          </div>

          {/* 10. Apel final */}
          <div className={`${container} mt-16 border-t border-ivory/10 pt-14 text-center lg:mt-20`}>
            <p className="font-display text-[34px] leading-tight text-gold-metal sm:text-[42px]">
              Începe {course.title}
            </p>
            <p className="mt-3 text-[15px] text-ivory/70">
              {lessonsLabel(course.lessons.length)} · {formatDuration(course.totalSeconds)} · {price}
            </p>
            <ButtonLink href={buyHref} className="mt-8 h-[52px] px-12">
              Cumpără cursul
            </ButtonLink>
          </div>
        </section>
      </main>

      <HomeFooter />

      {/* Pe telefon, butonul de cumpărare rămâne fix jos */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-ivory/10 bg-ink/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-[12px] text-ivory/60">{course.title}</p>
          <p className="font-display text-[22px] leading-tight text-ivory">{price}</p>
        </div>
        <ButtonLink href={buyHref} className="h-11 shrink-0 px-6">
          Cumpără cursul
        </ButtonLink>
      </div>
    </div>
  )
}
