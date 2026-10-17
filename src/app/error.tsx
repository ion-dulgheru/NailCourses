'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Wordmark } from '@/components/home/primitives'

// Mesaj generic: detaliile tehnice ajung doar în consolă/loguri, nu la vizitator.
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-ink px-5 text-center text-ivory">
      <Wordmark />
      <h1 className="mt-12 font-display text-[40px] leading-[1.05] text-gold-metal sm:text-[52px]">Ceva n-a mers bine</h1>
      <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-ivory/70">
        A apărut o eroare neașteptată. Încearcă din nou; dacă problema continuă, scrie-ne.
      </p>
      {error.digest && <p className="mt-3 font-mono text-[11px] text-ivory/35">Cod: {error.digest}</p>}
      <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-11 items-center justify-center bg-gold-metal px-7 text-[12px] font-medium uppercase tracking-[0.14em] text-ink transition hover:brightness-110"
        >
          Încearcă din nou
        </button>
        <Link href="/" className="text-[14px] text-ivory/80 underline underline-offset-4 hover:text-champagne-light">
          Înapoi acasă
        </Link>
        <Link href="/contact" className="text-[14px] text-ivory/80 underline underline-offset-4 hover:text-champagne-light">
          Contact
        </Link>
      </div>
    </main>
  )
}
