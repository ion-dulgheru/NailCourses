'use client'

import { useOptimistic, useTransition } from 'react'
import { Check, Circle } from 'lucide-react'
import { setLessonCompleted } from '@/lib/actions/student.actions'
import { cn } from '@/lib/utils'

export function CompleteButton({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const [pending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(completed)

  const toggle = () =>
    startTransition(async () => {
      setOptimistic(!optimistic)
      await setLessonCompleted(lessonId, !optimistic)
    })

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={optimistic}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2.5 px-6 text-[12px] font-medium uppercase tracking-[0.14em] transition duration-300 disabled:cursor-wait',
        optimistic
          ? 'border border-champagne/60 text-champagne-light hover:border-ivory/40 hover:text-ivory'
          : 'bg-gold-metal text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-110',
      )}
    >
      {optimistic ? (
        <>
          <Check className="size-4" strokeWidth={2} aria-hidden="true" />
          Lecție terminată
        </>
      ) : (
        <>
          <Circle className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Marchează ca terminată
        </>
      )}
    </button>
  )
}
