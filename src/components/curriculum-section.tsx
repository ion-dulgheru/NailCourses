import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, PlayCircle, Check, Lock, BadgeCheck } from 'lucide-react'

const modules = [
  {
    title: 'Modul 1: Introducere',
    tag: 'Bunny.net',
    lessons: ['Prezentarea cursului', 'Instrumente și materiale', 'Video introductiv'],
    open: true,
  },
  {
    title: 'Modul 2: Tehnici de bază',
    tag: 'Bunny.net',
    lessons: ['Pregătirea unghiei', 'Aplicarea bazei', 'Video demonstrativ'],
    open: true,
  },
  {
    title: 'Modul 3: Tehnici combinate',
    lessons: ['Manichiură combinată', 'Corectarea formei'],
  },
  {
    title: 'Modul 4: Tehnici avansate',
    lessons: ['Designuri elegante', 'Ojă semipermanentă avansată'],
  },
  { title: 'Modul 5: Sterilizare', lessons: ['Igienă', 'Sterilizarea instrumentelor'] },
  { title: 'Modul 6: Certificat', lessons: ['Evaluare finală', 'Eliberarea certificatului'] },
]

const priceFeatures = [
  'Full Access',
  'Certificat Recunoscut',
  'Garanție de Bază',
  'Card Bancar / MIA — Plăți Instant',
]

export function CurriculumSection() {
  return (
    <section id="inscriere" className="flex flex-col gap-8 px-6 py-6 lg:px-4">
      <div className="space-y-3">
        {modules.map((mod) => (
          <details
            key={mod.title}
            open={mod.open}
            className="group rounded-lg border border-border bg-card"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                {mod.title}
              </span>
              <span className="flex items-center gap-2">
                {mod.tag && <span className="text-xs text-muted-foreground">{mod.tag}</span>}
                <ChevronDown
                  className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </span>
            </summary>
            <ul className="space-y-2 border-t border-border px-4 py-3">
              {mod.lessons.map((lesson) => (
                <li key={lesson} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PlayCircle className="size-4 text-gold" aria-hidden="true" />
                  {lesson}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      {/* Certificate */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
        <div className="relative aspect-[3/2] w-32 shrink-0 overflow-hidden rounded-md ring-1 ring-gold/25">
          <Image
            src="/images/certificate.png"
            alt="Certificat recunoscut de absolvire"
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
        <div>
          <h3 className="font-serif text-lg text-foreground">Certificat Recunoscut</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            La finalul cursului primești un certificat recunoscut care îți atestă competențele.
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-xl bg-brand-dark p-8 text-center text-primary-foreground ring-1 ring-gold/30">
        <p className="text-sm uppercase tracking-[0.25em] text-primary-foreground/60">
          Pachet Cursuri
        </p>
        <p className="mt-3 font-serif text-5xl text-gold">300 MDL</p>

        <ul className="mt-6 space-y-3 text-left">
          {priceFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-primary-foreground/85">
              <Check className="size-4 shrink-0 text-gold" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href="#inscriere"
          className="mt-7 flex w-full items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90"
        >
          Cumpără Cursul (MDL)
        </Link>

        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-primary-foreground/60">
          <span className="flex items-center gap-1.5">
            <Lock className="size-3.5 text-gold" aria-hidden="true" />
            Securizat de Paynet
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="size-3.5 text-gold" aria-hidden="true" />
            Certificat Verificat
          </span>
        </div>
      </div>
    </section>
  )
}
