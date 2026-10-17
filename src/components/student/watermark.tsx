'use client'

import { useEffect, useState } from 'react'

// Pozițiile prin care trece filigranul (procente din player), departe de controalele de jos.
const SPOTS = [
  { top: '8%', left: '6%' },
  { top: '12%', left: '58%' },
  { top: '42%', left: '30%' },
  { top: '30%', left: '64%' },
  { top: '60%', left: '8%' },
  { top: '64%', left: '52%' },
]
const MOVE_EVERY_MS = 15_000

// Emailul elevului peste video, discret și mobil: face partajarea înregistrărilor riscantă.
// Nu poate bloca înregistrarea ecranului; doar o face identificabilă.
export function Watermark({ text }: { text: string }) {
  const [spot, setSpot] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSpot((current) => (current + 1 + Math.floor(Math.random() * (SPOTS.length - 1))) % SPOTS.length)
    }, MOVE_EVERY_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <span
      aria-hidden="true"
      style={SPOTS[spot]}
      className="pointer-events-none absolute z-10 select-none font-mono text-[11px] tracking-wide whitespace-nowrap text-white/45 [text-shadow:0_0_3px_rgba(0,0,0,0.85)] transition-[top,left] duration-[2000ms] ease-in-out sm:text-[13px]"
    >
      {text}
    </span>
  )
}
