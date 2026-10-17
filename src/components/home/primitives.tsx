import Link from 'next/link'
import { cn } from '@/lib/utils'

export const container = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10'

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
        'text-center font-display text-[28px] leading-[1.15] font-normal uppercase tracking-[0.03em] sm:text-[36px] lg:text-[42px]',
        tone === 'dark' ? 'text-ink' : 'text-ivory',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

const buttonBase =
  'inline-flex h-11 items-center justify-center px-7 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4'

const buttonVariants = {
  gold: 'bg-gold-metal text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-110 focus-visible:outline-champagne',
  'outline-dark':
    'border border-ink/70 text-ink normal-case tracking-normal text-[14px] font-normal hover:bg-ink hover:text-ivory focus-visible:outline-ink',
  'outline-light':
    'border border-ivory/80 text-ivory normal-case tracking-normal text-[14px] font-normal hover:bg-ivory hover:text-ink focus-visible:outline-ivory',
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
