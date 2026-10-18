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
        <section className="bg-ink pt-32 pb-14 text-ivory lg:pt-44 lg:pb-20">
          <div className={`${container} grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8`}>
            <div className="lg:col-span-7">
              <p className="text-[14px] text-champagne-light/80">{eyebrow}</p>
              <h1 className="mt-3 font-display text-[44px] leading-[1] font-light tracking-[-0.015em] text-balance sm:text-[56px] lg:text-[68px]">
                {title}
              </h1>
            </div>
            {intro && (
              <div className="max-w-[30rem] text-[15px] leading-[1.65] text-ivory/65 sm:text-[16px] lg:col-span-5">
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
    <div className="max-w-[44rem] text-[15px] leading-[1.75] text-stone sm:text-[16px] [&_a]:text-bronze [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ink [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[30px] [&_h2]:font-light [&_h2]:leading-tight [&_h2]:text-ink [&_h2:first-child]:mt-0 [&_li]:mt-2 [&_p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  )
}
