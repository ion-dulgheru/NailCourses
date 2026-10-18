import Image from 'next/image'
import Link from 'next/link'
import { Wordmark } from '@/components/home/primitives'

// Panoul foto al paginilor de cont: bandă sus pe mobil, jumătatea stângă (fixă) pe desktop.
function AuthPhoto() {
  return (
    <section className="relative h-[300px] overflow-hidden bg-ink sm:h-[360px] lg:sticky lg:top-0 lg:h-svh">
      <Image
        src="/images/register-hands.jpg"
        alt="Mână cu manichiură aurie sidefată, inele și lănțișor auriu"
        fill
        preload
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-[60%_55%] lg:object-[55%_50%]"
      />
      {/* Contrast pentru logo sus și pentru citatul de jos */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/0 via-30% to-ink lg:to-ink/80" />

      <div className="relative flex h-full flex-col justify-between px-5 pt-5 pb-6 sm:px-8 lg:px-12 lg:pt-8 lg:pb-14 xl:px-16">
        <Wordmark />

        <figure className="hidden max-w-[420px] lg:block">
          <blockquote className="font-display text-[34px] leading-[1.15] font-light text-ivory italic xl:text-[40px]">
            Frumusețea stă în detalii. Noi te învățăm să le stăpânești.
          </blockquote>
          <figcaption className="mt-4 text-[14px] text-champagne-light/80">
            GJ Nail Academy
          </figcaption>
        </figure>
      </div>

      <a
        href="https://unsplash.com/photos/5fe0JfJK7iI"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 bottom-3 hidden text-[10px] tracking-wide text-ivory/35 transition-colors hover:text-ivory/70 lg:block"
      >
        Foto: Shalom Ejiofor / Unsplash
      </a>
    </section>
  )
}

// Cadrul comun pentru autentificare și înregistrare: foto + coloana cu formularul.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-dark min-h-svh bg-ink text-ivory lg:grid lg:grid-cols-2">
      <AuthPhoto />

      <div className="flex flex-col px-5 pt-2 pb-10 sm:px-8 lg:min-h-svh lg:border-l lg:border-champagne/15 lg:px-16 lg:py-8 xl:px-24">
        <Link
          href="/"
          className="hidden self-end text-[14px] text-ivory/60 transition-colors hover:text-ivory lg:block"
        >
          Înapoi la site
        </Link>

        <div className="flex flex-1 items-center lg:py-10">{children}</div>

        <p className="mt-10 text-[12px] text-ivory/35 lg:mt-0">© GJ Nail Academy</p>
      </div>
    </main>
  )
}
