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
    <section className="grid gap-6 border-t border-line py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
      <div>
        <h2 className="font-display text-[26px] leading-tight text-ink">{title}</h2>
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
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-champagne-light">Contul tău</p>
            <h1 className="mt-4 pb-1 font-display text-[44px] leading-[1.05] font-normal text-gold-metal sm:text-[56px]">
              Contul meu
            </h1>
            <p className="mt-4 text-[15px] text-ivory/70">
              Cont creat pe {dateFormat.format(user.createdAt)} ·{' '}
              <Link href="/cursurile-mele" className="underline decoration-ivory/30 underline-offset-4 hover:text-champagne-light">
                {user._count.enrollments} {user._count.enrollments === 1 ? 'curs' : 'cursuri'}
              </Link>{' '}
              ·{' '}
              <Link href="/certificate" className="underline decoration-ivory/30 underline-offset-4 hover:text-champagne-light">
                {user._count.certificates} {user._count.certificates === 1 ? 'certificat' : 'certificate'}
              </Link>{' '}
              ·{' '}
              <Link href="/cont/comenzi" className="underline decoration-ivory/30 underline-offset-4 hover:text-champagne-light">
                istoric comenzi
              </Link>
            </p>
          </div>
        </section>

        <div className={`${container} pt-4 pb-16`}>
          <Section title="Date personale" description="Numele apare pe certificatele tale.">
            <NameForm name={user.name} surname={user.surname} />
          </Section>

          <Section title="Email" description="Adresa cu care te autentifici.">
            <p className="flex h-12 items-center border border-line bg-sand/60 px-4 text-[16px] text-ink">{user.email}</p>
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
