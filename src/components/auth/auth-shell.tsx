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
      {/* Contrast pentru logo sus și trecere lină spre fundalul negru jos */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/0 via-30% to-ink lg:via-ink/0 lg:via-45% lg:to-ink/90" />
      <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-r from-transparent to-ink lg:block" />

      <div className="relative flex h-full flex-col justify-between px-5 pt-5 pb-6 sm:px-8 lg:px-12 lg:pt-8 lg:pb-14 xl:px-16">
        <Wordmark />

        <figure className="hidden max-w-[420px] lg:block">
          <span aria-hidden="true" className="block h-px w-12 bg-gold-metal" />
          <blockquote className="mt-6 font-display text-[34px] leading-[1.15] font-light text-ivory italic xl:text-[40px]">
            Frumusețea stă în detalii. Noi te învățăm să le stăpânești.
          </blockquote>
          <figcaption className="mt-5 text-[11px] font-medium uppercase tracking-[0.28em] text-champagne-light">
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

      <div className="relative flex flex-col px-5 pt-2 pb-10 sm:px-8 lg:min-h-svh lg:px-12 lg:py-8">
        {/* Strălucire aurie discretă în spatele formularului */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-champagne/[0.06] blur-[120px]" />
        </div>

        <Link
          href="/"
          className="relative hidden self-end text-[11px] font-medium uppercase tracking-[0.22em] text-ivory/50 transition-colors hover:text-champagne-light lg:block"
        >
          ← Înapoi la site
        </Link>

        <div className="relative flex flex-1 items-center justify-center lg:py-10">{children}</div>

        <p className="relative mt-10 text-center text-[11px] uppercase tracking-[0.22em] text-ivory/30 lg:mt-0">
          © GJ Nail Academy
        </p>
      </div>
    </main>
  )
}
