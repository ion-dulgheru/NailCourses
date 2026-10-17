import type { Metadata } from 'next'
import { container } from '@/components/home/primitives'
import { PageShell } from '@/components/public/page-shell'
import { ContactForm } from '@/components/public/contact-form'
import { getSettings, telHref } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Contact — GJ Nail Academy',
  description: 'Scrie-ne o întrebare despre cursuri, plată sau contul tău. Datele de contact ale GJ Nail Academy.',
}

export default async function ContactPage() {
  const settings = await getSettings()

  const details = [
    { label: 'Telefon', value: settings.firma_telefon, href: telHref(settings.firma_telefon) },
    settings.contact_email && { label: 'Email', value: settings.contact_email, href: `mailto:${settings.contact_email}` },
    settings.instagram_url && {
      label: 'Instagram',
      value: settings.instagram_url.replace(/^https:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, ''),
      href: settings.instagram_url,
      external: true,
    },
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean }[]

  const company = [
    { label: 'Denumire', value: settings.firma_denumire },
    { label: 'Nr. de înregistrare (IDNO)', value: settings.firma_idno },
    { label: 'Adresă', value: settings.firma_adresa },
  ].filter((row) => row.value)

  return (
    <PageShell
      eyebrow="Contact"
      title="Scrie-ne"
      intro={<p>Ai o întrebare despre un curs, plată sau contul tău? Îți răspundem pe email.</p>}
    >
      <section className={`${container} grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20 lg:py-16`}>
        <div>
          <h2 className="font-display text-[28px] leading-tight text-ink">Trimite un mesaj</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-10">
          <div>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-bronze">Date de contact</h2>
            <dl className="mt-4 space-y-4">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-[12px] text-stone">{d.label}</dt>
                  <dd className="mt-0.5 text-[16px]">
                    <a
                      href={d.href}
                      {...(d.external && { target: '_blank', rel: 'noopener noreferrer' })}
                      className="break-words text-ink underline-offset-4 hover:text-bronze hover:underline"
                    >
                      {d.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {company.length > 0 && (
            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-bronze">Datele firmei</h2>
              <dl className="mt-4 space-y-4">
                {company.map((row) => (
                  <div key={row.label}>
                    <dt className="text-[12px] text-stone">{row.label}</dt>
                    <dd className="mt-0.5 text-[15px] text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </section>
    </PageShell>
  )
}
