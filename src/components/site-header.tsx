import Link from 'next/link'
import Logo from './Logo'
import { auth, signOut } from '@/auth'
import { LogOut } from 'lucide-react'

const navLinks = [
  { label: 'Cursurile Mele ', href: '#acasa' },
  { label: 'Catalog', href: '#programa' },
  { label: 'Despre noi', href: '#despre' },
]

export async function SiteHeader() {
  const session = await auth()

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-[#160D08]/90 via-[#160D08]/30 to-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-start gap-8 lg:gap-12 px-6 py-6 sm:px-10 lg:px-16">
        
        {/* Logo în stânga */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Meniu Navigație + Buton grupate în zona întunecată a paginii */}
        <div className="hidden md:flex items-center gap-7">
          <nav className="flex items-center gap-7" aria-label="Navigație principală">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-light text-[#d5c8b5]/85 transition-colors duration-200 hover:text-[#dfbf78]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Separator vertical fin */}
          <div className="h-4 w-[1px] bg-[#dfbf78]/25" />

          {/* Buton Acțiune */}
          {session?.user ? (
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-[#dfbf78]/40 bg-[#160D08]/60 px-3.5 py-1.5 text-xs font-medium text-[#dfbf78] backdrop-blur-md transition-all duration-200 hover:border-[#dfbf78] hover:bg-[#dfbf78]/10"
              >
                <LogOut size={14} />
                <span>Deconectare</span>
              </button>
            </form>
          ) : (
            <Link
              href="/autentificare"
              className="inline-flex items-center justify-center rounded-xl border border-[#dfbf78]/40 bg-[#160D08]/60 px-3.5 py-1.5 text-xs font-medium text-[#dfbf78] backdrop-blur-md transition-all duration-200 hover:border-[#dfbf78] hover:bg-[#dfbf78]/10 shadow-[0_0_15px_rgba(223,191,120,0.1)]"
            >
              Înregistrare / Login
            </Link>
          )}
        </div>

        {/* Zona din dreapta rămâne goală intenționat pentru a pune în valoare portretul */}
      </div>
    </header>
  )
}