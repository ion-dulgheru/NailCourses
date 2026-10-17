import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { container } from '@/components/home/primitives'
import { PageShell } from '@/components/public/page-shell'

export const metadata: Metadata = {
  title: 'Întrebări frecvente — GJ Nail Academy',
  description: 'Răspunsuri despre plată, accesul la cursuri, certificat, rambursare și probleme tehnice.',
}

// TODO: răspunsurile finale le confirmă clienta (mai ales durata accesului și rambursarea).
const groups: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: 'Cumpărare și plată',
    items: [
      {
        q: 'Ce metode de plată acceptați?',
        a: 'Plata se face online, cu cardul bancar, pe pagina securizată a băncii maib. Datele cardului nu ajung la noi.',
      },
      {
        q: 'În ce monedă sunt prețurile?',
        a: 'Toate prețurile sunt în lei moldovenești (MDL).',
      },
      {
        q: 'Am plătit, dar nu văd cursul. Ce fac?',
        a: (
          <>
            Accesul apare după ce banca confirmă plata, de obicei în câteva secunde. Verifică{' '}
            <Link href="/cont/comenzi">istoricul comenzilor</Link>. Dacă plata apare ca reușită și tot nu vezi
            cursul, <Link href="/contact">scrie-ne</Link>.
          </>
        ),
      },
    ],
  },
  {
    title: 'Acces la curs',
    items: [
      {
        q: 'Cât timp am acces?',
        a: 'Ai acces pe viață la cursul cumpărat, inclusiv la actualizările viitoare.',
      },
      {
        q: 'Pot vedea lecțiile pe telefon?',
        a: 'Da. Lecțiile merg pe telefon, tabletă sau calculator, oricând ai conexiune la internet.',
      },
      {
        q: 'Am nevoie de experiență anterioară?',
        a: 'Nu pentru cursurile de nivel începător: pornesc de la zero. Nivelul fiecărui curs e scris pe pagina lui.',
      },
      {
        q: 'Pot da contul altcuiva?',
        a: (
          <>
            Nu. Un cont este pentru o singură persoană, iar partajarea lui este interzisă prin{' '}
            <Link href="/termeni-si-conditii">termeni și condiții</Link>.
          </>
        ),
      },
    ],
  },
  {
    title: 'Certificat',
    items: [
      {
        q: 'Primesc certificat?',
        a: 'Da. După ce marchezi toate lecțiile unui curs ca terminate, primești un certificat de absolvire cu numele tău și un cod unic.',
      },
      {
        q: 'Cum descarc certificatul?',
        a: (
          <>
            Din pagina <Link href="/certificate">Certificate</Link>: deschide certificatul și alege „Descarcă PDF”.
          </>
        ),
      },
    ],
  },
  {
    title: 'Rambursare',
    items: [
      {
        q: 'Ce se întâmplă dacă nu sunt mulțumită?',
        a: (
          <>
            Condițiile în care îți poți recupera banii sunt descrise în{' '}
            <Link href="/politica-de-rambursare">politica de rambursare</Link>.
          </>
        ),
      },
    ],
  },
  {
    title: 'Probleme tehnice',
    items: [
      {
        q: 'Videoclipul nu pornește. Ce fac?',
        a: 'Reîncarcă pagina și verifică conexiunea la internet. Dacă problema continuă, încearcă alt browser (Chrome, Safari) sau scrie-ne.',
      },
      {
        q: 'Mi-am uitat parola.',
        a: (
          <>
            <Link href="/contact">Scrie-ne</Link> de pe adresa de email a contului și te ajutăm să-ți recapeți
            accesul.
          </>
        ),
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="Ajutor"
      title="Întrebări frecvente"
      intro={<p>Tot ce trebuie să știi înainte și după ce cumperi un curs.</p>}
    >
      <section className={`${container} py-12 lg:py-16`}>
        <div className="mx-auto max-w-3xl space-y-14">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-bronze">{group.title}</h2>
              <div className="mt-4 border-t border-line">
                {group.items.map((item) => (
                  <details key={item.q} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[20px] leading-snug text-ink sm:text-[22px] [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <Plus
                        className="size-5 shrink-0 text-bronze transition-transform duration-300 group-open:rotate-45"
                        strokeWidth={1.3}
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="pb-6 text-[15px] leading-[1.75] text-stone [&_a]:text-bronze [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ink">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-[15px] text-stone">
          Nu ai găsit răspunsul?{' '}
          <Link href="/contact" className="text-ink underline underline-offset-4">
            Scrie-ne
          </Link>
          .
        </p>
      </section>
    </PageShell>
  )
}
