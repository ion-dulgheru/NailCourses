import { cn } from '@/lib/utils'

export function ProgressBar({
  done,
  total,
  label,
  tone = 'light',
  className,
}: {
  done: number
  total: number
  label: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  const percent = total ? Math.round((done / total) * 100) : 0

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn('h-1 w-full overflow-hidden', tone === 'light' ? 'bg-line/50' : 'bg-ivory/15')}
      >
        <div className="h-full bg-gold-metal transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className={cn('mt-2 text-[12px]', tone === 'light' ? 'text-stone' : 'text-ivory/60')}>
        {done} din {total} lecții · {percent}%
      </p>
    </div>
  )
}
