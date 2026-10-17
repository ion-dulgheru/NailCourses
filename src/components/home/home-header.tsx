import Link from 'next/link'
import { getCurrentUser } from '@/lib/current-user'
import { ButtonLink, Wordmark } from './primitives'
import { MobileMenu } from './mobile-menu'
import { StickyHeader } from './sticky-header'
import { AccountMenu, type HeaderUser } from './account-menu'

export const navLinks = [
  { label: 'Cursuri', href: '/cursuri' },
  { label: 'Despre', href: '/despre' },
  { label: 'Contact', href: '/contact' },
]

const navLinkClass = 'text-[14px] text-ivory transition-colors hover:text-champagne-light'

export async function HomeHeader() {
  const current = await getCurrentUser()
  const user: HeaderUser | null = current
    ? {
        name: [current.surname, current.name].filter(Boolean).join(' ') || 'Contul meu',
        email: current.email,
        isAdmin: current.role === 'admin',
      }
    : null

  return (
    <StickyHeader>
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[72px] lg:px-10">
        <Wordmark />

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Navigație principală">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span aria-hidden="true" className="h-5 w-px bg-ivory/20" />

          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/cursurile-mele" className={navLinkClass}>
                Cursurile mele
              </Link>
              <AccountMenu user={user} />
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/autentificare" className={navLinkClass}>
                Autentificare
              </Link>
              <ButtonLink href="/inregistrare" variant="outline-light" className="h-9 px-5">
                Creează cont
              </ButtonLink>
            </div>
          )}
        </div>

        <MobileMenu links={navLinks} user={user} />
      </div>
    </StickyHeader>
  )
}
