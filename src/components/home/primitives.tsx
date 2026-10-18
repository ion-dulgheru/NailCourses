import Link from 'next/link'
import { cn } from '@/lib/utils'

export const container = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10'

// Titlurile de secțiune: Cormorant subțire, aliniat la stânga, în propoziție.
// Un singur cuvânt-cheie poate fi pus în <em> — apare italic, în auriu plin.
export function SectionTitle({
  children,
  className,
  tone = 'dark',
  as: Tag = 'h2',
  id,
}: {
  children: React.ReactNode
  className?: string
  tone?: 'dark' | 'light'
  as?: 'h2' | 'h3'
  id?: string
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'font-display text-[36px] leading-[1.02] font-light tracking-[-0.01em] text-balance sm:text-[46px] lg:text-[56px] [&_em]:italic',
        tone === 'dark' ? 'text-ink [&_em]:text-bronze' : 'text-ivory [&_em]:text-champagne',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

const buttonBase =
  'inline-flex h-12 items-center justify-center px-7 text-[14px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4'

// Auriul plin e rezervat butonului principal; restul butoanelor sunt contururi discrete.
const buttonVariants = {
  gold: 'bg-champagne text-ink hover:bg-champagne-light focus-visible:outline-champagne',
  'outline-dark':
    'border border-ink/20 font-normal text-ink hover:border-ink focus-visible:outline-ink',
  'outline-light':
    'border border-ivory/25 font-normal text-ivory hover:border-ivory focus-visible:outline-ivory',
}

export function ButtonLink({
  href,
  variant = 'gold',
  className,
  children,
}: {
  href: string
  variant?: keyof typeof buttonVariants
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={cn(buttonBase, buttonVariants[variant], className)}>
      {children}
    </Link>
  )
}

// Etichetă mică în auriu plin (nivelul cursului, „Probă gratuită”).
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center bg-champagne px-2 text-[12px] leading-none font-medium text-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('font-display leading-none text-ivory italic', className)}
    >
      GJ
    </span>
  )
}

export function Wordmark({ stacked = false }: { stacked?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="GJ Nail Academy — acasă"
      className={cn(
        'inline-flex items-center text-ivory',
        stacked ? 'flex-col gap-2' : 'gap-2.5',
      )}
    >
      <Monogram className={stacked ? 'text-[44px]' : 'text-[26px]'} />
      <span
        className={cn(
          'font-display uppercase',
          stacked
            ? 'text-center text-[13px] leading-[1.3] tracking-[0.2em]'
            : 'text-[14px] tracking-[0.08em]',
        )}
      >
        Nail Academy
      </span>
    </Link>
  )
}
