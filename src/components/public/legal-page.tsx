import { container } from '@/components/home/primitives'
import { getSettings } from '@/lib/settings'
import { PageShell, Prose } from './page-shell'

const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })

// Textele legale nu se inventează: vin de la clientă sau de la un jurist. Până atunci,
// pagina afișează structura cerută și un avertisment vizibil că textul e provizoriu.
export async function LegalPage({
  title,
  updatedAt,
  draft = true,
  children,
}: {
  title: string
  updatedAt: Date
  draft?: boolean
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const company = [
    settings.firma_denumire,
    settings.firma_idno && `IDNO ${settings.firma_idno}`,
    settings.firma_adresa,
    settings.firma_telefon,
    settings.contact_email,
  ].filter(Boolean)

  return (
    <PageShell eyebrow="Informații legale" title={title} intro={<p>Ultima actualizare: {dateFormat.format(updatedAt)}</p>}>
      <section className={`${container} py-12 lg:py-16`}>
        {draft && (
          <p role="note" className="mx-auto mb-10 max-w-[44rem] border-l-2 border-champagne bg-sand/60 px-5 py-4 text-[14px] text-ink">
            Text provizoriu. Versiunea finală, validată de un jurist, va fi publicată înainte de lansarea plăților.
          </p>
        )}
        <Prose>
          {children}
          <h2>Datele vânzătorului</h2>
          <p>{company.join(' · ')}</p>
        </Prose>
      </section>
    </PageShell>
  )
}
