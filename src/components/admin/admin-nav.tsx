'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutDashboard, Receipt, Settings, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin', label: 'Panou', icon: LayoutDashboard, exact: true },
  { href: '/admin/cursuri', label: 'Cursuri', icon: BookOpen },
  { href: '/admin/elevi', label: 'Elevi', icon: Users },
  { href: '/admin/comenzi', label: 'Comenzi', icon: Receipt },
  { href: '/admin/setari', label: 'Setări', icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigație admin">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors lg:px-4',
                  active
                    ? 'bg-ivory/10 text-ivory'
                    : 'text-ivory/60 hover:bg-ivory/5 hover:text-ivory',
                )}
              >
                <Icon
                  className={cn('size-4', active ? 'text-champagne' : 'text-ivory/40')}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
