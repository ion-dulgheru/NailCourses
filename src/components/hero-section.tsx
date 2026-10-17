import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="acasa"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#160D08]"
    >
      {/* ── Imaginea poziționată pe jumătatea din dreapta (fără zoom excesiv) ── */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 h-full w-full md:w-[60%] lg:w-[52%] select-none overflow-hidden">
        <Image
          src="/images/hero-woman.png"
          alt="Instructoare de manichiură la GJ Nail Studio"
          fill
          priority
          className="object-cover object-top md:object-[center_top]"
          sizes="(max-width: 768px) 100vw, 55vw"
        />

        {/* Gradient stânga -> dreapta (estompare lină în fundalul maro) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#160D08] via-[#160D08]/70 to-transparent max-md:bg-[#160D08]/85" />

        {/* Gradient subtil sus și jos */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#160D08]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#160D08] to-transparent" />
      </div>

      {/* ── Conținut Text & Butoane ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 pt-24 pb-16">
        <div className="max-w-xl lg:max-w-2xl space-y-6">
          <h1 className="font-serif text-[2.4rem] leading-[1.12] text-[#f5ead9] sm:text-[3.2rem] lg:text-[4rem]">
            Începe o carieră
            <br />
            <span className="text-[#dfbf78] italic font-light">creativă și frumoasă!</span>
          </h1>

          <p className="max-w-lg text-[0.95rem] leading-relaxed text-[#d5c8b5]/90 sm:text-base lg:text-lg">
            Masterclass complet de manichiură modernă susținut de experți certificați din Ialoveni. Tehnici de la bază până la perfecționare.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="#programa"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#c9a84c] via-[#e5c97b] to-[#b38f2b] px-8 py-3.5 text-base font-bold text-[#1a1209] shadow-lg shadow-black/50 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Vezi Programa Cursului
            </Link>
          </div>

          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#dfbf78]/30 bg-black/40 px-4 py-2 backdrop-blur-md text-xs sm:text-sm text-[#e2d5c7]">
            <ShieldCheck className="h-4 w-4 text-[#dfbf78]" />
            <span>Acces pe viață | Plată Securizată (Card / MIA)</span>
          </div>
        </div>
      </div>
    </section>
  )
}