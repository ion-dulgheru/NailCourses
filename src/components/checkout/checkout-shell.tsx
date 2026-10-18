import Image from 'next/image'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { container } from '@/components/home/primitives'

// Cadrul paginilor de checkout: bandă scurtă cu titlul, apoi conținutul pe fundal deschis.
export function CheckoutShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <HomeHeader />

      <main>
        <section className="bg-ink pt-28 pb-10 text-ivory lg:pt-36 lg:pb-12">
          <div className={container}>
            <p className="text-[14px] text-champagne-light/80">{eyebrow}</p>
            <h1 className="mt-3 font-display text-[40px] leading-[1] font-light tracking-[-0.01em] sm:text-[52px]">
              {title}
            </h1>
          </div>
        </section>

        <div className={`${container} py-10 lg:py-16`}>{children}</div>
      </main>

      <HomeFooter />
    </div>
  )
}

// Rezumatul cursului din comandă: copertă, titlu, preț (cifrele în mono).
export function OrderSummary({
  title,
  coverImage,
  coverAlt,
  price,
  details,
}: {
  title: string
  coverImage: string
  coverAlt: string
  price: string
  details?: React.ReactNode
}) {
  return (
    <div className="flex gap-4 border border-champagne/20 p-4 sm:gap-5 sm:p-5">
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-sand sm:w-32">
        <Image src={coverImage} alt={coverAlt} fill sizes="128px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[20px] leading-snug text-ink sm:text-[24px]">{title}</p>
        {details && <div className="mt-1.5 font-mono text-[12px] text-stone">{details}</div>}
        <p className="mt-3 font-mono text-[18px] leading-none text-ink sm:text-[20px]">{price}</p>
      </div>
    </div>
  )
}
