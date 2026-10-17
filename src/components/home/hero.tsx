import Image from 'next/image'
import Link from 'next/link'
import { ButtonLink } from './primitives'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      {/* Imagine: sus pe mobil (titlul se suprapune pe partea de jos), jumătatea dreaptă pe desktop */}
      <div className="relative h-[68svh] min-h-[440px] md:h-[620px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[58%]">
        <Image
          src="/images/hero-hands-face.jpg"
          alt="Femeie cu manichiură nude, cu mâinile lângă față"
          fill
          preload
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/0 via-25% to-ink lg:bg-gradient-to-r lg:from-ink lg:via-ink/0 lg:via-30% lg:to-ink/10" />
        <div className="absolute inset-x-0 top-0 hidden h-28 bg-gradient-to-b from-ink/60 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-ink/70 to-transparent lg:block" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-12 sm:px-8 lg:flex lg:min-h-[100svh] lg:items-center lg:px-10 lg:pt-[72px] lg:pb-24">
        <div className="-mt-32 text-center md:-mt-40 lg:mt-0 lg:max-w-[520px] lg:text-left">
          <h1 className="font-display text-[44px] leading-[1.02] pb-2 font-normal text-gold-metal sm:text-[56px] lg:text-[68px]">
            Stăpânește arta
            <br />
            unghiilor impecabile
          </h1>

          <p className="mx-auto mt-5 max-w-[28rem] text-[15px] leading-[1.6] text-ivory sm:text-[16px] lg:mx-0 lg:text-[18px]">
            Descoperă cursuri profesionale de manichiură create pentru a-ți perfecționa tehnica,
            a-ți construi încrederea și a-ți transforma cariera în beauty.
          </p>

          <ButtonLink href="#cursuri" className="mt-7">
            Descoperă cursurile
          </ButtonLink>
        </div>
      </div>

      <Link
        href="#beneficii"
        className="group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-4 lg:flex"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-ivory/80 transition-colors duration-300 group-hover:text-champagne-light">
          Află mai multe
        </span>
        <span aria-hidden="true" className="relative h-14 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-champagne-light to-transparent motion-safe:animate-scroll-cue" />
        </span>
      </Link>
    </section>
  )
}
