'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Header fix pe toată pagina: transparent peste hero, negru după ce începe derularea.
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b border-champagne/15 transition-colors duration-300',
        scrolled ? 'bg-ink' : 'bg-transparent',
      )}
    >
      {children}
    </header>
  )
}
