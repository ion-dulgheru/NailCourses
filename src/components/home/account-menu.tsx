'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, LogOut } from 'lucide-react'
import { signOutUser } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'

export type HeaderUser = { name: string; email: string; isAdmin: boolean }

const studentLinks = [
  { label: 'Cursurile mele', href: '/cursurile-mele' },
  { label: 'Certificate', href: '/certificate' },
  { label: 'Istoric comenzi', href: '/cont/comenzi' },
  { label: 'Contul meu', href: '/cont' },
]

export function accountLinks(user: HeaderUser) {
  return user.isAdmin ? [{ label: 'Panou admin', href: '/admin' }, ...studentLinks] : studentLinks
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutUser}>
      <button type="submit" className={className}>
        <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
        Ieși din cont
      </button>
    </form>
  )
}

// Meniul de cont din header (desktop): avatar cu inițiale + listă derulantă.
export function AccountMenu({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="meniu-cont"
        className="group flex items-center gap-2 text-ivory"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-gold-metal text-[12px] font-semibold tracking-wide text-ink">
          {initials(user.name) || '•'}
        </span>
        <span className="sr-only">Meniul contului</span>
        <ChevronDown
          className={cn('size-4 text-ivory/70 transition-transform duration-200', open && 'rotate-180')}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id="meniu-cont"
          role="menu"
          className="absolute top-full right-0 mt-3 w-64 border border-ivory/10 bg-ink py-2 text-ivory shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
        >
          <div className="border-b border-ivory/10 px-5 pt-2 pb-4">
            <p className="truncate font-display text-[20px] leading-tight">{user.name}</p>
            <p className="mt-1 truncate text-[12px] text-ivory/50">{user.email}</p>
          </div>
          <ul className="py-2">
            {accountLinks(user).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-2.5 text-[14px] text-ivory/80 transition-colors hover:bg-ivory/5 hover:text-champagne-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-ivory/10 pt-2">
            <SignOutButton className="flex w-full items-center gap-2.5 px-5 py-2.5 text-left text-[14px] text-ivory/60 transition-colors hover:bg-ivory/5 hover:text-ivory" />
          </div>
        </div>
      )}
    </div>
  )
}
