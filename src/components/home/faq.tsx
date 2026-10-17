import Link from 'next/link'
import { Plus } from 'lucide-react'
import { SectionTitle, container } from './primitives'

const faqs = [
  {
    q: 'Am nevoie de experiență anterioară?',
    a: 'Nu. Cursul Bazele Manichiurii pornește de la zero și te ghidează pas cu pas. Dacă lucrezi deja, poți începe direct cu Perfecționarea Tehnicii.',
  },
  {
    q: 'Cât timp am acces la lecții?',
    a: 'Ai acces pe viață la cursul achiziționat, inclusiv la actualizările viitoare.',
  },
  {
    q: 'Ce materiale îmi sunt necesare?',
    a: 'La începutul fiecărui curs primești lista completă cu instrumentele și materialele recomandate.',
  },
  {
    q: 'Primesc certificat la final?',
    a: 'Da. După finalizarea cursului primești un certificat de absolvire care îți atestă competențele.',
  },
  {
    q: 'Cum pot plăti?',
    a: 'Acceptăm plata cu cardul bancar și plăți instant prin MIA, procesate securizat.',
  },
]

export function Faq() {
  return (
    <section id="intrebari" className="scroll-mt-4 bg-ivory pb-16 lg:pb-24">
      <div className={`${container} border-t border-line pt-14 lg:pt-20`}>
        <SectionTitle>Întrebări frecvente</SectionTitle>

        <div className="mx-auto mt-10 max-w-3xl border-t border-line lg:mt-14">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[21px] leading-snug text-ink sm:text-[23px] [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  className="size-5 shrink-0 text-bronze transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={1.3}
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-6 text-[15px] leading-[1.75] text-stone">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-stone">
          <Link href="/intrebari-frecvente" className="text-ink underline underline-offset-4">
            Vezi toate întrebările
          </Link>{' '}
          sau{' '}
          <Link href="/contact" className="text-ink underline underline-offset-4">
            scrie-ne
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
