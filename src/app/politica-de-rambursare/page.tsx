import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/public/legal-page'

export const metadata: Metadata = {
  title: 'Politica de rambursare — GJ Nail Academy',
  description: 'În ce condiții poți primi banii înapoi pentru un curs online GJ Nail Academy.',
}

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Politica de rambursare" updatedAt={new Date('2026-10-17')}>
      <h2>Conținut digital cu acces imediat</h2>
      <p>
        Cursurile sunt conținut digital: accesul la lecții începe imediat după confirmarea plății.
      </p>

      <h2>Când poți cere banii înapoi</h2>
      <p>[De completat de clientă, împreună cu contabilul sau juristul: termenul și condițiile rambursării.]</p>

      <h2>Cum ceri rambursarea</h2>
      <p>
        Scrie-ne prin <Link href="/contact">pagina de contact</Link>, cu emailul contului și numele cursului.
        Banii se returnează pe cardul cu care ai plătit.
      </p>

      <h2>Ce se întâmplă cu accesul</h2>
      <p>După rambursare, accesul la curs se închide, iar certificatul pentru acel curs nu mai poate fi obținut.</p>
    </LegalPage>
  )
}
