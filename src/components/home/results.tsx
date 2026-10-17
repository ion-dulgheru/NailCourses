import Image from 'next/image'
import { SectionTitle } from './primitives'

type Tile =
  | { kind: 'text'; title: string; order: string }
  | { kind: 'image'; src: string; alt: string; order: string; mobileOnly?: boolean }

// Desktop (3 coloane): text | imagine | text, pe două rânduri — ca în machetă.
// Mobil (2 coloane): ordinea se rearanjează într-o tablă de șah, cu două imagini în plus.
const tiles: Tile[] = [
  { kind: 'text', title: 'Tehnică impecabilă', order: 'order-1' },
  { kind: 'image', src: '/images/nail-french.png', alt: 'French manichiură clasică', order: 'order-2' },
  { kind: 'text', title: 'Câștigă încredere', order: 'order-4' },
  { kind: 'text', title: 'Începe să lucrezi cu cliente', order: 'order-5' },
  { kind: 'image', src: '/images/nail-palepink.png', alt: 'Manichiură roz pal, unghii scurte', order: 'order-6' },
  { kind: 'text', title: 'Creează rezultate mai bune', order: 'order-8' },
  { kind: 'image', src: '/images/login.jpg', alt: 'Unghii roz lungi cu linii albe și strasuri', order: 'order-3', mobileOnly: true },
  { kind: 'image', src: '/images/nail-natural.png', alt: 'Manichiură nude naturală', order: 'order-7', mobileOnly: true },
]

export function Results() {
  return (
    <section id="rezultate" aria-labelledby="rezultate-titlu" className="bg-ivory">
      <div className="py-8 lg:py-10">
        <SectionTitle id="rezultate-titlu" className="px-5">
          Rezultate / Transformare
        </SectionTitle>
      </div>

      <ul className="grid grid-cols-2 bg-ink lg:grid-cols-3">
        {tiles.map((tile) =>
          tile.kind === 'text' ? (
            <li
              key={tile.title}
              className={`${tile.order} flex aspect-square items-center justify-center bg-ink p-5 text-center lg:order-none lg:aspect-[3/2]`}
            >
              <h3 className="max-w-[12ch] font-display text-[19px] leading-[1.15] uppercase tracking-[0.03em] text-ivory sm:text-[28px] lg:text-[32px]">
                {tile.title}
              </h3>
            </li>
          ) : (
            <li
              key={tile.src}
              className={`${tile.order} relative aspect-square overflow-hidden lg:order-none lg:aspect-[3/2] ${tile.mobileOnly ? 'lg:hidden' : ''}`}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
            </li>
          ),
        )}
      </ul>
    </section>
  )
}
