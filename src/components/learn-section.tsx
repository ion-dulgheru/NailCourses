import Image from 'next/image'
import { Brush, Droplet, Ruler, Palette, Heart, ShieldCheck } from 'lucide-react'

const items = [
  {
    icon: Brush,
    title: 'Manichiură clasică și combinată',
    description: 'Tehnici de manichiură clasică și combinată predate de experți din Ialoveni.',
    image: '/images/nail-french.png',
    alt: 'Manichiură franțuzească',
  },
  {
    icon: Droplet,
    title: 'Aplicarea ojei semipermanente',
    description: 'Aplicarea corectă și rezistentă a ojei semipermanente pe unghie.',
    image: '/images/nail-palepink.png',
    alt: 'Unghii roz cu ojă semipermanentă',
  },
  {
    icon: Ruler,
    title: 'Forma corectă a unghiei',
    description: 'Modelarea și aplicarea corectă a formei ideale pentru fiecare unghie.',
    image: '/images/nail-goldchain.png',
    alt: 'Unghii roz cu accent auriu',
  },
  {
    icon: Palette,
    title: 'Designuri simple și elegante',
    description: 'Designuri simple și elegante realizate cu ojă semipermanentă.',
    image: '/images/nail-darkpink.png',
    alt: 'Unghii roz închis cu design abstract',
  },
  {
    icon: Heart,
    title: 'Îngrijirea unghiei naturale',
    description: 'Îngrijirea și menținerea sănătoasă a unghiei naturale.',
    image: '/images/nail-natural.png',
    alt: 'Unghii naturale îngrijite',
  },
  {
    icon: ShieldCheck,
    title: 'Igienă și sterilizare',
    description: 'Reguli de igienă și sterilizare corectă a instrumentelor de lucru.',
    image: '/images/nail-hygiene.png',
    alt: 'Pedichiură roșie îngrijită',
  },
]

export function LearnSection() {
  return (
    <section id="programa" className="px-6 py-14 lg:px-10">
      <h2 className="text-center font-serif text-4xl tracking-wide text-gold">CE ÎNVEȚI:</h2>

      <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="flex items-start gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/50">
                <item.icon className="size-5 text-gold" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="relative ml-auto aspect-square w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-gold/20 sm:w-24">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
