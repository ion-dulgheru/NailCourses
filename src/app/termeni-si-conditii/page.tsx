import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/public/legal-page'

export const metadata: Metadata = {
  title: 'Termeni și condiții — GJ Nail Academy',
  description: 'Condițiile de utilizare a cursurilor online GJ Nail Academy.',
}

export default function TermsPage() {
  return (
    <LegalPage title="Termeni și condiții" updatedAt={new Date('2026-10-17')}>
      <h2>Ce vindem</h2>
      <p>
        GJ Nail Academy vinde acces la cursuri video online de manichiură. La cumpărare primești acces la lecțiile
        cursului ales, în contul tău de pe acest site. Nu se livrează produse fizice.
      </p>

      <h2>Durata accesului</h2>
      <p>[De completat: perioada pentru care elevul are acces la curs după cumpărare.]</p>

      <h2>Contul tău</h2>
      <ul>
        <li>Un cont aparține unei singure persoane și este pentru uz personal.</li>
        <li>Este interzisă partajarea contului sau a datelor de autentificare cu alte persoane.</li>
        <li>Ne rezervăm dreptul de a suspenda accesul în caz de partajare a contului.</li>
      </ul>

      <h2>Drepturi de autor</h2>
      <p>
        Videoclipurile, textele și materialele cursurilor sunt proprietatea GJ Nail Academy. Este interzisă
        descărcarea, înregistrarea, copierea sau distribuirea lor, integral sau parțial.
      </p>

      <h2>Prețuri și plată</h2>
      <p>
        Prețurile sunt afișate în lei moldovenești (MDL). Plata se face online, cu cardul, prin pagina securizată a
        băncii. Accesul la curs se acordă după confirmarea plății de către bancă.
      </p>

      <h2>Rambursări</h2>
      <p>
        Condițiile de rambursare sunt descrise în <Link href="/politica-de-rambursare">politica de rambursare</Link>.
      </p>

      <h2>Date personale</h2>
      <p>
        Modul în care îți prelucrăm datele este descris în{' '}
        <Link href="/politica-de-confidentialitate">politica de confidențialitate</Link>.
      </p>
    </LegalPage>
  )
}
