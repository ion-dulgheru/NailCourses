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
// Rar, ca să nu distragă; destul cât să nu poată fi tăiat dintr-un singur loc al înregistrării.
const MOVE_EVERY_MS = 45_000

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
      className="pointer-events-none absolute z-10 select-none font-mono text-[10px] tracking-wide whitespace-nowrap text-white/25 [text-shadow:0_0_2px_rgba(0,0,0,0.6)] transition-[top,left] duration-[3000ms] ease-in-out sm:text-[12px]"
    >
      {text}
    </span>
  )
}
