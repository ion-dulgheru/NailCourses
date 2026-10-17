import type { Metadata } from 'next'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { SETTING_FIELDS } from '@/lib/settings'
import { AdminPageHeader } from '@/components/admin/ui'
import { SettingsForm } from '@/components/admin/settings-form'

export const metadata: Metadata = { title: 'Setări' }

export default async function SettingsPage() {
  await requireAdminPage('/admin/setari')

  // Valorile salvate, fără valorile implicite, ca adminul să vadă ce lipsește încă.
  const rows = await prisma.setting.findMany({ where: { key: { in: SETTING_FIELDS.map((f) => f.key) } } })
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Configurare"
        title="Setări"
        description="Datele generale ale academiei: firmă, contact și certificat."
      />
      <SettingsForm fields={SETTING_FIELDS.map((f) => ({ ...f }))} values={values} />
    </div>
  )
}
