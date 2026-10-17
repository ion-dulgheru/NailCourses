import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/public/legal-page'

export const metadata: Metadata = {
  title: 'Politica de confidențialitate — GJ Nail Academy',
  description: 'Ce date personale colectăm, de ce și cum îți poți exercita drepturile.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Politica de confidențialitate" updatedAt={new Date('2026-10-17')}>
      <h2>Ce date colectăm</h2>
      <ul>
        <li>Numele și prenumele, pentru cont și pentru certificat;</li>
        <li>Adresa de email, pentru autentificare și mesaje despre cont și comenzi;</li>
        <li>Istoricul comenzilor și progresul la cursuri.</li>
      </ul>
      <p>
        Nu primim și nu păstrăm datele cardului tău: plata se face direct pe pagina securizată a băncii.
      </p>

      <h2>De ce le folosim</h2>
      <p>
        Pentru a-ți crea contul, a-ți da acces la cursurile cumpărate, a emite certificate și a-ți răspunde la
        mesaje.
      </p>

      <h2>Cine le prelucrează</h2>
      <ul>
        <li>Banca procesatoare a plăților (maib);</li>
        <li>Furnizorul de găzduire a site-ului și a bazei de date;</li>
        <li>Serviciul de găzduire video (Bunny);</li>
        <li>Serviciul prin care trimitem emailuri.</li>
      </ul>

      <h2>Cât timp le păstrăm</h2>
      <p>[De completat: perioada de păstrare a datelor, inclusiv cerințele contabile pentru comenzi.]</p>

      <h2>Drepturile tale</h2>
      <p>
        Poți cere oricând acces la datele tale, corectarea sau ștergerea lor. Contul îl poți șterge singur din
        pagina <Link href="/cont">Contul meu</Link>. Pentru orice altă cerere, folosește{' '}
        <Link href="/contact">pagina de contact</Link>.
      </p>

      <h2>Cookie-uri</h2>
      <p>
        Folosim doar cookie-uri necesare pentru autentificare. Nu folosim cookie-uri de analiză sau de publicitate.
      </p>
    </LegalPage>
  )
}
