import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { container } from '@/components/home/primitives'

// Cadrul comun al paginilor publice simple: antet, banda întunecată cu titlul, conținut, subsol.
export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-32 pb-14 text-center text-ivory lg:pt-40 lg:pb-20">
          <div className={container}>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-champagne-light">{eyebrow}</p>
            <h1 className="mt-4 pb-1 font-display text-[40px] leading-[1.05] font-normal text-gold-metal sm:text-[52px] lg:text-[60px]">
              {title}
            </h1>
            {intro && (
              <div className="mx-auto mt-5 max-w-[36rem] text-[15px] leading-[1.65] text-ivory/75 sm:text-[16px]">
                {intro}
              </div>
            )}
          </div>
        </section>

        {children}
      </main>

      <HomeFooter />
    </div>
  )
}

// Text lung (pagini legale, poveste): lățime de citire confortabilă și titluri de secțiune.
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[44rem] text-[15px] leading-[1.75] text-stone sm:text-[16px] [&_a]:text-bronze [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ink [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:leading-tight [&_h2]:text-ink [&_h2:first-child]:mt-0 [&_li]:mt-2 [&_p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  )
}
