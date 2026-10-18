import Image from 'next/image'
import { SectionTitle, container } from './primitives'
import { cn } from '@/lib/utils'

type Tile =
  | { kind: 'text'; title: string; text: string; className: string }
  | { kind: 'image'; src: string; alt: string; className: string; sizes: string }

// Bento: o fotografie mare, două mai mici și patru rezultate în text.
// Mobil: 2 coloane; desktop: 4 coloane pe trei rânduri.
const tiles: Tile[] = [
  {
    kind: 'image',
    src: '/images/nail-french.png',
    alt: 'French manichiură clasică',
    className: 'col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto',
    sizes: '(min-width: 1024px) 560px, 100vw',
  },
  {
    kind: 'text',
    title: 'Tehnică impecabilă',
    text: 'Pregătirea corectă a unghiei, aplicare uniformă, forme curate.',
    className: 'col-span-2 lg:col-span-1',
  },
  {
    kind: 'image',
    src: '/images/nail-palepink.png',
    alt: 'Manichiură roz pal, unghii scurte',
    className: 'aspect-[3/4] lg:row-span-2 lg:aspect-auto',
    sizes: '(min-width: 1024px) 280px, 50vw',
  },
  {
    kind: 'text',
    title: 'Încredere în ce faci',
    text: 'Știi de ce faci fiecare pas, nu doar cum.',
    className: '',
  },
  {
    kind: 'text',
    title: 'Primele cliente',
    text: 'Un ritm de lucru realist și un rezultat pe care îl poți arăta.',
    className: 'col-span-2',
  },
  {
    kind: 'image',
    src: '/images/nail-natural.png',
    alt: 'Manichiură nude naturală',
    className: 'aspect-square lg:aspect-auto',
    sizes: '(min-width: 1024px) 280px, 50vw',
  },
  {
    kind: 'text',
    title: 'Rezultate care țin',
    text: 'Manichiuri care rezistă, iar clientele revin.',
    className: '',
  },
]

export function Results() {
  return (
    <section id="rezultate" aria-labelledby="rezultate-titlu" className="bg-ink py-16 text-ivory lg:py-28">
      <div className={container}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <SectionTitle id="rezultate-titlu" tone="light" className="lg:col-span-6">
            Ce <em>câștigi</em> după curs
          </SectionTitle>
          <p className="max-w-[28rem] text-[15px] leading-[1.65] text-ivory/60 lg:col-span-5 lg:col-start-8 lg:text-[16px]">
            Ce urmărim în fiecare lecție: unghii curate, forme egale și un rezultat care rezistă.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4 lg:grid-rows-[240px_240px_220px]">
          {tiles.map((tile) =>
            tile.kind === 'text' ? (
              <li
                key={tile.title}
                className={cn(
                  'flex min-h-[180px] flex-col justify-end border border-champagne/15 p-5 lg:p-7',
                  tile.className,
                )}
              >
                <h3 className="font-display text-[24px] leading-[1.1] text-ivory lg:text-[30px]">{tile.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.55] text-ivory/60">{tile.text}</p>
              </li>
            ) : (
              <li key={tile.src} className={cn('relative overflow-hidden', tile.className)}>
                <Image src={tile.src} alt={tile.alt} fill sizes={tile.sizes} className="object-cover" />
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  )
}
