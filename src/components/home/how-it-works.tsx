import { SectionTitle, container } from './primitives'

const steps = [
  {
    title: 'Alegi cursul',
    text: 'Vezi programa, durata și ce materiale îți trebuie, apoi alegi nivelul potrivit pentru tine.',
  },
  {
    title: 'Plătești cu cardul',
    text: 'Plată securizată, direct pe pagina băncii, în lei. Accesul la lecții se deschide imediat.',
  },
  {
    title: 'Înveți oricând',
    text: 'Pe telefon sau calculator, în ritmul tău. La final primești certificatul de absolvire.',
  },
]

export function HowItWorks() {
  return (
    <section id="cum-functioneaza" aria-labelledby="cum-functioneaza-titlu" className="bg-sand py-16 lg:py-24">
      <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <SectionTitle id="cum-functioneaza-titlu" className="lg:col-span-4">
          Cum <em>funcționează</em>
        </SectionTitle>

        <ol className="lg:col-span-8">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-2 border-t border-champagne/20 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[3rem_14rem_1fr] sm:gap-x-6 lg:py-8"
            >
              <span aria-hidden="true" className="pt-2 font-mono text-[13px] text-bronze">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-[26px] leading-tight text-ink lg:text-[30px]">{step.title}</h3>
              <p className="col-start-2 text-[15px] leading-[1.65] text-stone sm:col-start-3 sm:pt-1.5 lg:text-[16px]">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
