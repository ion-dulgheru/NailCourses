import Image from 'next/image'
import { SectionTitle, container } from './primitives'

// Doar recenzii reale, cu acordul cursantelor (text, nume). Cât timp lista e goală,
// secțiunea arată doar fotografia reală cu absolventele, fără citate.
const testimonials: { quote: string; name: string }[] = []

export function Testimonials() {
  return (
    <section id="experiente" className="bg-ivory py-16 lg:py-28">
      <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-4">
          <SectionTitle>
            Absolventele <em>noastre</em>
          </SectionTitle>
          <p className="mt-5 max-w-[22rem] text-[15px] leading-[1.65] text-stone">
            Cursante GJ Nail Studio, în ziua în care și-au primit diplomele.
          </p>

          {testimonials.length > 0 && (
            <ul className="mt-10">
              {testimonials.map((t) => (
                <li key={t.name} className="border-t border-champagne/20 py-6">
                  <blockquote className="font-display text-[22px] leading-[1.35] text-ink">„{t.quote}”</blockquote>
                  <p className="mt-3 text-[14px] text-stone">{t.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <figure className="lg:col-span-8">
          <div className="relative aspect-[4/3] overflow-hidden bg-sand sm:aspect-[16/10]">
            <Image
              src="/images/students.png"
              alt="Absolvente GJ Nail Studio cu diplomele primite, în fața logo-ului studioului"
              fill
              sizes="(min-width: 1200px) 760px, 100vw"
              className="object-cover object-[50%_40%]"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}
