import type { Metadata } from 'next'
import Link from 'next/link'
import { ButtonLink } from '@/components/home/primitives'
import { PageShell } from '@/components/public/page-shell'

export const metadata: Metadata = {
  title: 'Pagina nu există — GJ Nail Academy',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <PageShell
      eyebrow="Eroare 404"
      title="Pagina nu există"
      intro={<p>Linkul poate fi greșit sau pagina a fost mutată.</p>}
    >
      <section className="flex flex-col items-center justify-center gap-5 px-5 py-16 sm:flex-row lg:py-24">
        <ButtonLink href="/cursuri">Vezi cursurile</ButtonLink>
        <Link href="/" className="text-[14px] text-ink underline underline-offset-4 hover:text-bronze">
          Înapoi acasă
        </Link>
      </section>
    </PageShell>
  )
}
