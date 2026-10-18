'use client'

import { useState } from 'react'
import { deleteCourse } from '@/lib/actions/admin.actions'
import { ConfirmButton } from './ui'

export function CourseDangerZone({ courseId, hasStudents }: { courseId: string; hasStudents: boolean }) {
  const [error, setError] = useState('')

  if (hasStudents) {
    return (
      <p className="text-[14px] text-stone">
        Cursul are elevi cu acces, deci nu poate fi șters. Ca să-l ascunzi de pe site, trece-l pe „Ciornă”.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[14px] text-stone">Șterge definitiv cursul, toate lecțiile lui și videoclipurile și PDF-urile lor din spațiul de stocare. Nu se poate anula.</p>
      <div className="flex flex-col items-start gap-2">
        <ConfirmButton
          label="Șterge cursul"
          confirmLabel="Da, șterge definitiv"
          action={async () => {
            const result = await deleteCourse(courseId)
            if (result && !result.ok) setError(result.message)
          }}
        />
        {error && (
          <p role="alert" className="text-[13px] text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
