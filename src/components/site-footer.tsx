import { Phone, MapPin, Navigation } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 lg:px-10">
        <div>
          <p className="font-serif text-2xl text-gold">GJ Nail Studio</p>
          <p className="mt-1 text-sm text-primary-foreground/70">Studio de manichiură — Ialoveni</p>

          <ul className="mt-6 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-gold" aria-hidden="true" />
              060 206 061
            </li>
            <li className="flex items-center gap-2">
              <Navigation className="size-4 text-gold" aria-hidden="true" />
              Anchor From Ialoveni
            </li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl ring-1 ring-gold/20">
          <div className="relative h-56 w-full">
            <iframe
              title="Locația GJ Nail Studio în Ialoveni"
              src="https://www.google.com/maps?q=Ialoveni,Moldova&output=embed"
              className="h-full w-full grayscale-[0.2]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-brand-dark/80 px-2 py-1 text-xs text-gold">
              <MapPin className="size-3.5" aria-hidden="true" />
              Ialoveni
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-6 py-5 text-xs text-primary-foreground/60 lg:px-10">
          <span>Termeni și Condiții</span>
          <span>Politică de Confidențialitate</span>
        </div>
      </div>
    </footer>
  )
}
