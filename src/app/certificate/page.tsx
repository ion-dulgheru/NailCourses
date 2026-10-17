import type { Metadata } from 'next'
import Link from 'next/link'
import { Award } from 'lucide-react'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { DownloadCertificate } from '@/components/student/download-certificate'
import { ButtonLink, container } from '@/components/home/primitives'
import { requireStudent } from '@/lib/student'
import { getMyCertificates } from '@/lib/certificates'

export const metadata: Metadata = {
  title: 'Certificatele mele — GJ Nail Academy',
  robots: { index: false },
}

const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })

export default async function CertificatesPage() {
  const user = await requireStudent('/certificate')
  const certificates = await getMyCertificates(user.id)

  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-32 pb-12 text-ivory lg:pt-40 lg:pb-16">
          <div className={container}>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-champagne-light">Contul tău</p>
            <h1 className="mt-4 pb-1 font-display text-[44px] leading-[1.05] font-normal text-gold-metal sm:text-[56px]">
              Certificatele mele
            </h1>
            <p className="mt-4 max-w-[32rem] text-[15px] leading-[1.65] text-ivory/70">
              Primești un certificat pentru fiecare curs la care termini toate lecțiile.
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className={container}>
            {certificates.length === 0 ? (
              <div className="mx-auto max-w-lg border border-line px-6 py-14 text-center">
                <Award className="mx-auto size-10 text-bronze" strokeWidth={1} aria-hidden="true" />
                <p className="mt-4 font-display text-[30px] leading-tight text-ink">Încă nu ai certificate</p>
                <p className="mt-3 text-[15px] leading-[1.6] text-stone">
                  Marchează toate lecțiile unui curs ca terminate și certificatul apare aici automat.
                </p>
                <ButtonLink href="/cursurile-mele" className="mt-7">
                  Cursurile mele
                </ButtonLink>
              </div>
            ) : (
              <ul className="grid gap-5 md:grid-cols-2">
                {certificates.map((c) => (
                  <li key={c.id}>
                    <article className="flex h-full flex-col border border-line p-6 sm:p-8">
                      <div className="flex items-start gap-4">
                        <Award className="size-9 shrink-0 text-bronze" strokeWidth={1} aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-bronze">
                            Certificat de absolvire
                          </p>
                          <h2 className="mt-1.5 font-display text-[28px] leading-tight text-ink">{c.course.title}</h2>
                        </div>
                      </div>
                      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line/70 pt-5 text-[13px]">
                        <div>
                          <dt className="text-stone">Emis pe</dt>
                          <dd className="mt-0.5 text-ink">{dateFormat.format(c.issuedAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-stone">Cod</dt>
                          <dd className="mt-0.5 font-mono text-ink">{c.code}</dd>
                        </div>
                      </dl>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <DownloadCertificate code={c.code} className="h-10" />
                        <ButtonLink href={`/certificate/${c.code}`} variant="outline-dark" className="h-10 px-6">
                          Vezi certificatul
                        </ButtonLink>
                        <Link
                          href={`/cursurile-mele/${c.course.slug}`}
                          className="inline-flex h-10 items-center px-2 text-[13px] text-stone underline-offset-4 hover:text-ink hover:underline"
                        >
                          Revezi cursul
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}
