import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Ce metode de plată acceptați (MIA)?',
    a: 'Acceptăm plata cu cardul bancar și plăți instant prin MIA, procesate securizat de Paynet.',
  },
  {
    q: 'Pentru cât timp am acces la curs?',
    a: 'Ai acces pe viață la toate modulele cursului, inclusiv actualizările viitoare.',
  },
  {
    q: 'Ce materiale îmi sunt necesare?',
    a: 'La începutul cursului primești lista completă cu instrumentele și materialele recomandate.',
  },
  {
    q: 'Este nevoie de experiență anterioară?',
    a: 'Nu. Cursul pornește de la zero și te ghidează pas cu pas până la nivel avansat.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-6 lg:px-4">
      <h2 className="text-center font-serif text-3xl text-foreground">FAQ</h2>
      <div className="mt-6 space-y-3">
        {faqs.map((faq) => (
          <details key={faq.q} className="group rounded-lg border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground">
              {faq.q}
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
