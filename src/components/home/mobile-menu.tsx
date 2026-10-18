'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { SignOutButton, accountLinks, initials, type HeaderUser } from './account-menu'

export function MobileMenu({
  links,
  user,
}: {
  links: { label: string; href: string }[]
  user: HeaderUser | null
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Deschide meniul"
        aria-expanded={open}
        aria-controls="meniu-mobil"
        className="-mr-2 flex size-11 items-center justify-center text-ivory"
      >
        <Menu className="size-6" strokeWidth={1.3} />
      </button>

      {open && (
        <div
          id="meniu-mobil"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu"
          className="fixed inset-0 z-50 flex flex-col bg-ink px-5 pb-10 text-ivory sm:px-8"
        >
          <div className="flex h-20 items-center justify-between">
            <span className="text-[13px] text-ivory/50">Meniu</span>
            <button
              type="button"
              onClick={close}
              aria-label="Închide meniul"
              className="-mr-2 flex size-11 items-center justify-center"
            >
              <X className="size-6" strokeWidth={1.3} />
            </button>
          </div>

          <nav aria-label="Navigație mobilă" className="mt-10 flex-1">
            <ul className="border-t border-champagne/15">
              {links.map((link, i) => (
                <li key={link.href} className="border-b border-champagne/15">
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex items-baseline gap-5 py-6 font-display text-4xl font-light"
                  >
                    <span className="font-sans text-[11px] tracking-[0.2em] text-champagne">
                      0{i + 1}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {user ? (
              <div className="mt-10">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-champagne text-[13px] font-semibold text-ink">
                    {initials(user.name) || '•'}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[20px] leading-tight">{user.name}</p>
                    <p className="truncate text-[12px] text-ivory/50">{user.email}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-1">
                  {accountLinks(user).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className="block py-2 text-[15px] text-ivory/80 transition-colors hover:text-champagne-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <SignOutButton className="flex items-center gap-2.5 py-2 text-[15px] text-ivory/50 transition-colors hover:text-ivory" />
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mt-10 flex gap-6 text-[15px]">
                <Link
                  href="/autentificare"
                  onClick={close}
                  className="text-ivory/80 underline-offset-4 hover:text-champagne-light hover:underline"
                >
                  Autentificare
                </Link>
                <Link
                  href="/inregistrare"
                  onClick={close}
                  className="text-champagne-light underline-offset-4 hover:underline"
                >
                  Creează cont
                </Link>
              </div>
            )}
          </nav>

          <Link
            href="/cursuri"
            onClick={close}
            className="flex h-14 items-center justify-center bg-champagne text-[15px] font-medium text-ink"
          >
            Vezi cursurile
          </Link>
        </div>
      )}
    </div>
  )
}
