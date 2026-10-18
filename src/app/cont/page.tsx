import type { Metadata } from 'next'
import Link from 'next/link'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { container } from '@/components/home/primitives'
import { DeleteAccountForm, NameForm, PasswordForm } from '@/components/account/account-forms'
import { requireStudent } from '@/lib/student'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Contul meu — GJ Nail Academy',
  robots: { index: false },
}

const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })

function Section({ title, description, children }: { title: string; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-champagne/20 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
      <div>
        <h2 className="font-display text-[30px] leading-tight font-light text-ink">{title}</h2>
        {description && <p className="mt-2 text-[14px] leading-[1.6] text-stone">{description}</p>}
      </div>
      <div className="max-w-[560px]">{children}</div>
    </section>
  )
}

export default async function AccountPage() {
  const current = await requireStudent('/cont')
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: current.id },
    select: {
      name: true,
      surname: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { enrollments: true, certificates: true } },
    },
  })

  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-32 pb-12 text-ivory lg:pt-40 lg:pb-16">
          <div className={container}>
            <p className="text-[14px] text-champagne-light/80">Contul tău</p>
            <h1 className="mt-4 font-display text-[44px] leading-[1] font-light tracking-[-0.015em] sm:text-[56px]">
              Contul meu
            </h1>
            <p className="mt-4 text-[15px] text-ivory/60">Cont creat pe {dateFormat.format(user.createdAt)}</p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-champagne/15 pt-6 text-[15px]">
              <li>
                <Link href="/cursurile-mele" className="text-ivory underline decoration-champagne/40 underline-offset-[6px] hover:decoration-champagne">
                  <span className="font-mono">{user._count.enrollments}</span> {user._count.enrollments === 1 ? 'curs' : 'cursuri'}
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="text-ivory underline decoration-champagne/40 underline-offset-[6px] hover:decoration-champagne">
                  <span className="font-mono">{user._count.certificates}</span>{' '}
                  {user._count.certificates === 1 ? 'certificat' : 'certificate'}
                </Link>
              </li>
              <li>
                <Link href="/cont/comenzi" className="text-ivory underline decoration-champagne/40 underline-offset-[6px] hover:decoration-champagne">
                  Istoric comenzi
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <div className={`${container} pt-4 pb-16`}>
          <Section title="Date personale" description="Numele apare pe certificatele tale.">
            <NameForm name={user.name} surname={user.surname} />
          </Section>

          <Section title="Email" description="Adresa cu care te autentifici.">
            <p className="flex h-12 items-center border border-champagne/20 bg-sand px-4 text-[16px] text-ink">{user.email}</p>
            <p className="mt-2 text-[13px] text-stone">
              Pentru a schimba adresa de email,{' '}
              <Link href="/contact" className="text-bronze underline underline-offset-4 hover:text-ink">
                scrie-ne
              </Link>
              .
            </p>
          </Section>

          <Section title="Parolă">
            <PasswordForm />
          </Section>

          <Section
            title="Ștergerea contului"
            description="Poți cere oricând ștergerea contului și a datelor tale."
          >
            {user.role === 'admin' ? (
              <p className="text-[14px] text-stone">Contul de administrator nu poate fi șters de aici.</p>
            ) : (
              <DeleteAccountForm />
            )}
          </Section>
        </div>
      </main>

      <HomeFooter />
    </div>
  )
}
