'use client'

import { useActionState } from 'react'
import { saveSettings, type AdminFormState } from '@/lib/actions/admin.actions'
import { AdminCard, AdminField, FormMessage, SaveButton } from './ui'
import { adminInput } from './styles'

export type SettingField = { key: string; label: string; group: string; hint?: string }

const groups = [
  { id: 'firma', title: 'Datele firmei', description: 'Apar în subsolul site-ului, pe pagina de contact și în paginile legale. Banca le cere înainte de a activa plățile.' },
  { id: 'contact', title: 'Contact și rețele sociale', description: 'Linkurile goale nu se afișează pe site.' },
  { id: 'certificat', title: 'Certificat', description: 'Textele care apar pe certificatul de absolvire.' },
]

const initialState: AdminFormState = { ok: false, message: '' }

export function SettingsForm({ fields, values }: { fields: SettingField[]; values: Record<string, string> }) {
  const [state, action] = useActionState(saveSettings, initialState)

  const value = (key: string) => state.values?.[key] ?? values[key] ?? ''
  const err = (key: string) => state.errors?.[key]

  return (
    <form action={action} className="space-y-6">
      {groups.map((group) => (
        <AdminCard key={group.id} title={group.title} description={group.description}>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields
              .filter((f) => f.group === group.id)
              .map((f) => (
                <AdminField key={f.key} id={f.key} label={f.label} hint={f.hint} error={err(f.key)}>
                  <input
                    id={f.key}
                    name={f.key}
                    type={f.key === 'contact_email' ? 'email' : f.key.endsWith('_url') ? 'url' : 'text'}
                    defaultValue={value(f.key)}
                    className={adminInput}
                    {...(err(f.key) ? { 'aria-invalid': true, 'aria-describedby': `${f.key}-error` } : {})}
                  />
                </AdminField>
              ))}
          </div>
        </AdminCard>
      ))}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SaveButton label="Salvează setările" />
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  )
}
