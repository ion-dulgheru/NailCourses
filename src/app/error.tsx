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
    <main className="flex min-h-svh flex-col justify-center bg-ink px-5 text-ivory sm:px-16 lg:px-24">
      <Wordmark />
      <h1 className="mt-12 font-display text-[44px] leading-[1] font-light sm:text-[60px]">
        Ceva n-a mers <em className="text-champagne italic">bine</em>
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-ivory/70">
        A apărut o eroare neașteptată. Încearcă din nou; dacă problema continuă, scrie-ne.
      </p>
      {error.digest && <p className="mt-3 font-mono text-[12px] text-ivory/35">Cod: {error.digest}</p>}
      <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-12 items-center justify-center bg-champagne px-7 text-[14px] font-medium text-ink transition-colors hover:bg-champagne-light"
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
