import type { Metadata } from 'next'
import Image from 'next/image'
import { ButtonLink, SectionTitle, container } from '@/components/home/primitives'
import { PageShell } from '@/components/public/page-shell'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Despre instructoare — GJ Nail Academy',
  description: 'Cunoaște instructoarea GJ Nail Academy, fondatoarea GJ Nail Studio: parcurs, formare și lucrări.',
}

// TODO: povestea, parcursul și diplomele le trimite clienta; textele de mai jos sunt provizorii.
const portfolio = [
  { src: '/images/nail-french.png', alt: 'French manichiură pe unghii în formă de migdală' },
  { src: '/images/nail-natural.png', alt: 'Manichiură nude pe unghii scurte' },
  { src: '/images/nail-goldchain.png', alt: 'Unghii roz pudrat cu lanț auriu aplicat' },
  { src: '/images/nail-darkpink.png', alt: 'Manichiură în nuanță de roz închis' },
  { src: '/images/nail-palepink.png', alt: 'Manichiură în nuanță de roz pal' },
  { src: '/images/nail-jars.png', alt: 'Materiale de lucru pentru manichiură' },
]

export default async function AboutPage() {
  const settings = await getSettings()

  return (
    <PageShell eyebrow="Despre" title="Instructoarea ta">
      <section className={`${container} grid gap-10 py-12 sm:grid-cols-2 sm:items-center lg:gap-16 lg:py-20`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          <Image
            src="/images/instructor.png"
            alt="Fondatoarea GJ Nail Studio, în salon, în fața logo-ului studioului"
            fill
            priority
            sizes="(min-width: 1200px) 560px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-[52%_50%]"
          />
        </div>

        <div className="space-y-4 text-[15px] leading-[1.75] text-stone sm:text-[16px]">
          <h2 className="font-display text-[28px] leading-tight text-ink sm:text-[34px]">Fondatoarea GJ Nail Studio</h2>
          <p>
            Ani de lucru zilnic în salon, cu cliente reale și standarde ridicate. Tot ce predau a fost testat mai
            întâi în practică.
          </p>
          <p>
            Filozofia mea: îți explic nu doar ce să faci, ci și de ce, ca să lucrezi cu siguranță și să capeți
            încredere în propria tehnică.
          </p>
          <p>
            Lucrez cu tehnici moderne, actualizate constant, și ofer fiecărei cursante îndrumarea de care are
            nevoie pentru a crește.
          </p>
        </div>
      </section>

      <section className="bg-sand/50 py-14 lg:py-20">
        <div className={container}>
          <SectionTitle>Parcurs și formare</SectionTitle>
          {/* TODO: lista reală de diplome și cursuri urmate, de la clientă. */}
          <p className="mx-auto mt-6 max-w-[36rem] text-center text-[15px] leading-[1.75] text-stone">
            Diplomele și cursurile de specializare urmate vor fi adăugate aici.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className={container}>
          <SectionTitle>Portofoliu</SectionTitle>
          <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:gap-8">
            {portfolio.map((w) => (
              <li key={w.src} className="group relative aspect-square overflow-hidden bg-sand">
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(min-width: 1240px) 380px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <ButtonLink href="/cursuri">Vezi cursurile</ButtonLink>
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-ink underline underline-offset-4 hover:text-bronze"
              >
                Mai multe lucrări pe Instagram
              </a>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
