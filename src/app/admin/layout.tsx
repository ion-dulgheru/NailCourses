import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { requireAdminPage } from '@/lib/admin'
import { Wordmark } from '@/components/home/primitives'
import { AdminNav } from '@/components/admin/admin-nav'
import { SignOutButton } from '@/components/home/account-menu'

export const metadata: Metadata = {
  title: { default: 'Admin — GJ Nail Academy', template: '%s — Admin GJ' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage()
  const fullName = [admin.surname, admin.name].filter(Boolean).join(' ')

  return (
    <div className="min-h-svh bg-sand lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-ink text-ivory lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 lg:block lg:px-6 lg:pt-7 lg:pb-8">
          <Wordmark />
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne lg:mt-3 lg:block">
            Administrare
          </span>
        </div>

        <div className="px-3 pb-3 lg:flex-1 lg:px-3">
          <AdminNav />
        </div>

        <div className="hidden border-t border-ivory/10 px-6 py-5 lg:block">
          <p className="truncate text-[14px] text-ivory">{fullName}</p>
          <p className="truncate text-[12px] text-ivory/45">{admin.email}</p>
          <Link
            href="/"
            className="mt-4 flex items-center gap-2 text-[13px] text-ivory/60 transition-colors hover:text-champagne-light"
          >
            <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Vezi site-ul
          </Link>
          <SignOutButton className="mt-2 flex items-center gap-2 text-[13px] text-ivory/60 transition-colors hover:text-ivory" />
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1080px]">{children}</div>
      </main>
    </div>
  )
}
