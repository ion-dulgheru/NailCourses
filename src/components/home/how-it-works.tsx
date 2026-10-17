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
    <section id="cum-functioneaza" aria-labelledby="cum-functioneaza-titlu" className="bg-sand/60 py-14 lg:py-20">
      <div className={container}>
        <SectionTitle id="cum-functioneaza-titlu">Cum funcționează</SectionTitle>

        <ol className="mx-auto mt-10 grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-6 lg:mt-14 lg:gap-12">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-5 sm:flex-col sm:gap-0 sm:text-center">
              <span
                aria-hidden="true"
                className="font-display text-[44px] leading-none text-bronze sm:text-[56px]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="sm:mt-4">
                <h3 className="font-display text-[24px] leading-tight text-ink lg:text-[28px]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.65] text-stone lg:text-[16px]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
