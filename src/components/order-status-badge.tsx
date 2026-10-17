import type { OrderStatus } from '@/generated/prisma/client'
import { ORDER_STATUS } from '@/lib/orders'
import { cn } from '@/lib/utils'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = ORDER_STATUS[status]
  return (
    <span className={cn('inline-flex px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em] whitespace-nowrap', className)}>
      {label}
    </span>
  )
}
