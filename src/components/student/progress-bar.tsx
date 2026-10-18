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
        className={cn('h-px w-full', tone === 'light' ? 'bg-champagne/25' : 'bg-champagne/20')}
      >
        <div className="-mt-px h-[3px] bg-champagne transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className={cn('mt-2.5 flex justify-between font-mono text-[12px]', tone === 'light' ? 'text-stone' : 'text-ivory/60')}>
        <span>
          {done}/{total} lecții
        </span>
        <span>{percent}%</span>
      </p>
    </div>
  )
}
