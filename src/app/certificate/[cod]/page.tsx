import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/current-user'
import { getCertificateForViewer } from '@/lib/certificates'
import { getSettings } from '@/lib/settings'
import { DownloadCertificate } from '@/components/student/download-certificate'

type Props = { params: Promise<{ cod: string }> }

export const metadata: Metadata = {
  title: 'Certificat de absolvire — GJ Nail Academy',
  robots: { index: false },
}

const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })

export default async function CertificatePage({ params }: Props) {
  const { cod } = await params
  const viewer = await getCurrentUser()
  if (!viewer) redirect(`/autentificare?callbackUrl=${encodeURIComponent(`/certificate/${cod}`)}`)

  const [certificate, settings] = await Promise.all([
    getCertificateForViewer(cod.toUpperCase(), viewer),
    getSettings(),
  ])
  if (!certificate) notFound()

  const studentName = [certificate.user.surname, certificate.user.name].filter(Boolean).join(' ')

  return (
    <div className="min-h-svh bg-ink-soft print:bg-transparent">
      <style>{`@page { size: A4 landscape; margin: 0; } @media print { html, body { background: #fff !important; } }`}</style>

      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 print:hidden">
        <Link
          href="/certificate"
          className="inline-flex items-center gap-2 text-[13px] text-ivory/70 transition-colors hover:text-champagne-light"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Certificatele mele
        </Link>
        <DownloadCertificate code={certificate.code} />
      </div>

      {/* Certificatul: proporții A4 orizontal; dimensiunile textului scalează cu lățimea (cqw). */}
      <div className="mx-auto max-w-[1180px] px-5 pb-12 sm:px-8 print:max-w-none print:p-0">
        <article
          className="@container relative mx-auto aspect-[297/210] w-full overflow-hidden bg-ivory text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] [print-color-adjust:exact] print:h-[210mm] print:w-[297mm] print:shadow-none"
          aria-label={`Certificat de absolvire pentru ${studentName}`}
        >
          {/* Rame aurii */}
          <div aria-hidden="true" className="absolute inset-[2.6cqw] border-[0.35cqw] border-champagne" />
          <div aria-hidden="true" className="absolute inset-[3.6cqw] border-[0.12cqw] border-champagne/60" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,170,110,0.10),transparent_70%)]" />

          <div className="relative flex h-full flex-col items-center px-[9cqw] pt-[7.5cqw] pb-[6.5cqw] text-center">
            <p className="font-display text-[4.2cqw] leading-none italic text-bronze">GJ</p>
            <p className="mt-[0.6cqw] font-display text-[1.25cqw] uppercase tracking-[0.35em] text-stone">Nail Academy</p>

            <h1 className="mt-[3.2cqw] font-display text-[3.6cqw] leading-none font-normal uppercase tracking-[0.12em] text-ink">
              Certificat de absolvire
            </h1>
            <span aria-hidden="true" className="mt-[1.6cqw] block h-[0.12cqw] w-[9cqw] bg-champagne" />

            <p className="mt-[2.6cqw] text-[1.45cqw] uppercase tracking-[0.2em] text-stone">Se acordă</p>
            <p className="mt-[1cqw] font-display text-[5.6cqw] leading-[1.05] italic text-bronze">{studentName}</p>
            <p className="mt-[2cqw] text-[1.55cqw] text-stone">{settings.certificat_text || 'pentru finalizarea cu succes a cursului'}</p>
            <p className="mt-[0.8cqw] font-display text-[3.1cqw] leading-tight text-ink">{certificate.course.title}</p>

            <div className="mt-auto grid w-full grid-cols-3 items-end gap-[3cqw] text-[1.3cqw]">
              <div className="text-left">
                <p className="text-stone">Data</p>
                <p className="mt-[0.4cqw] text-ink">{dateFormat.format(certificate.issuedAt)}</p>
              </div>
              <div>
                <span aria-hidden="true" className="mx-auto block h-[0.08cqw] w-[18cqw] bg-ink/40" />
                <p className="mt-[0.7cqw] text-ink">{settings.certificat_semnatura}</p>
                <p className="mt-[0.2cqw] text-stone">Instructoare</p>
              </div>
              <div className="text-right">
                <p className="text-stone">Cod certificat</p>
                <p className="mt-[0.4cqw] font-mono tracking-wide text-ink">{certificate.code}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
