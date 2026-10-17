import Image from 'next/image'
import { container } from './primitives'

const works = [
  { src: '/images/nail-french.png', alt: 'French manichiură pe unghii în formă de migdală' },
  { src: '/images/nail-natural.png', alt: 'Manichiură nude pe unghii scurte' },
  { src: '/images/nail-goldchain.png', alt: 'Unghii roz pudrat cu lanț auriu aplicat' },
]

export function Gallery() {
  return (
    <section id="galerie" aria-label="Galerie de lucrări" className="bg-ivory pb-16 lg:pb-24">
      <ul className={`${container} grid grid-cols-3 gap-2 sm:gap-5 lg:gap-8`}>
        {works.map((w) => (
          <li key={w.src} className="group relative aspect-[5/4] overflow-hidden bg-sand">
            <Image
              src={w.src}
              alt={w.alt}
              fill
              sizes="(min-width: 1240px) 380px, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
