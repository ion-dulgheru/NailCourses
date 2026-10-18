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
    <section id="intrebari" className="scroll-mt-4 bg-ivory pb-16 lg:pb-28">
      <div className={container}>
        <div className="grid gap-10 border-t border-champagne/20 pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-28">
          <div className="lg:col-span-4">
            <SectionTitle>
              Întrebări <em>frecvente</em>
            </SectionTitle>
            <p className="mt-5 text-[15px] leading-[1.65] text-stone">
              <Link
                href="/intrebari-frecvente"
                className="text-ink underline decoration-champagne/50 underline-offset-[6px] hover:decoration-bronze"
              >
                Vezi toate întrebările
              </Link>{' '}
              sau{' '}
              <Link
                href="/contact"
                className="text-ink underline decoration-champagne/50 underline-offset-[6px] hover:decoration-bronze"
              >
                scrie-ne
              </Link>
              .
            </p>
          </div>

          <div className="lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-champagne/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[22px] leading-snug text-ink group-first:pt-0 sm:text-[25px] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus
                    className="size-5 shrink-0 text-bronze transition-transform duration-300 group-open:rotate-45"
                    strokeWidth={1.3}
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-[40rem] pb-7 text-[15px] leading-[1.75] text-stone">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
