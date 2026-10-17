'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const INTERVAL_MS = 3000
const MAX_ATTEMPTS = 40 // ~2 minute

// Reîncarcă datele paginii (de pe server) până când callback-ul băncii actualizează comanda.
export function AutoRefresh() {
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) return
    const timer = setTimeout(() => {
      router.refresh()
      setAttempts((n) => n + 1)
    }, INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [attempts, router])

  if (attempts < MAX_ATTEMPTS) return null
  return (
    <p className="mt-4 text-[14px] text-stone">
      Confirmarea durează mai mult decât de obicei. Reîncarcă pagina peste câteva minute sau verifică istoricul
      comenzilor.
    </p>
  )
}
