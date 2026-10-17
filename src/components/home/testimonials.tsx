import Image from 'next/image'
import { SectionTitle, container } from './primitives'

// Doar recenzii reale, cu acordul cursantelor (text, nume). Cât timp lista e goală,
// secțiunea arată doar fotografia reală cu absolventele, fără citate.
const testimonials: { quote: string; name: string }[] = []

export function Testimonials() {
  return (
    <section id="experiente" className="bg-ivory py-14 lg:py-20">
      <div className={container}>
        <SectionTitle>Absolventele noastre</SectionTitle>

        {testimonials.length > 0 && (
          <ul className="mx-auto mt-10 grid max-w-5xl gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-12 lg:gap-12">
            {testimonials.map((t) => (
              <li key={t.name} className="flex flex-col items-center text-center">
                <span
                  aria-hidden="true"
                  className="flex size-14 items-center justify-center rounded-full border border-line bg-sand font-display text-2xl text-bronze italic"
                >
                  {t.name.charAt(0)}
                </span>
                <blockquote className="mt-4 text-[15px] leading-[1.65] text-stone">„{t.quote}”</blockquote>
                <p className="mt-3 text-[14px] font-semibold text-ink">{t.name}</p>
              </li>
            ))}
          </ul>
        )}

        <figure className="mx-auto mt-10 max-w-4xl lg:mt-12">
          <div className="relative aspect-[4/3] overflow-hidden bg-sand sm:aspect-[16/10]">
            <Image
              src="/images/students.png"
              alt="Absolvente GJ Nail Studio cu diplomele primite, în fața logo-ului studioului"
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover object-[50%_40%]"
            />
          </div>
          <figcaption className="mt-4 text-center text-[14px] text-stone">
            Absolvente ale cursurilor GJ Nail Studio, cu diplomele primite.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
