'use client'

import { refundOrder } from '@/lib/actions/admin.actions'
import { ConfirmButton } from './ui'
import { adminButton } from './styles'

export function RefundButton({ orderId }: { orderId: string }) {
  return (
    <ConfirmButton
      action={() => refundOrder(orderId)}
      label="Marchează rambursată"
      confirmLabel="Confirm rambursarea"
      className={adminButton.small}
    />
  )
}
