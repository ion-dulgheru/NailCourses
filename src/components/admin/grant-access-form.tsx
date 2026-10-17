'use client'

import { useActionState } from 'react'
import { grantAccess, type AdminFormState } from '@/lib/actions/admin.actions'
import { FormMessage, SaveButton } from './ui'
import { adminInput } from './styles'

const initialState: AdminFormState = { ok: false, message: '' }

export function GrantAccessForm({
  userId,
  courses,
}: {
  userId: string
  courses: { id: string; title: string; status: string }[]
}) {
  const [state, action] = useActionState(grantAccess, initialState)

  if (courses.length === 0) {
    return <p className="text-[14px] text-stone">Elevul are deja acces la toate cursurile.</p>
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="courseId" className="sr-only">
          Curs
        </label>
        <select id="courseId" name="courseId" required defaultValue="" className={`${adminInput} sm:flex-1`}>
          <option value="" disabled>
            Alege cursul…
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
              {c.status === 'ciorna' ? ' (ciornă)' : ''}
            </option>
          ))}
        </select>
        <SaveButton label="Acordă acces" pendingLabel="Se acordă…" />
      </div>
      <FormMessage state={state} />
    </form>
  )
}
