'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, LayoutList, Pencil, Plus, Trash2, Video, VideoOff } from 'lucide-react'
import {
  deleteLesson,
  moveLesson,
  saveLesson,
  type AdminFormState,
} from '@/lib/actions/admin.actions'
import { formatDuration, lessonsLabel } from '@/lib/course-format'
import { AdminCard, AdminField, ConfirmButton, FormMessage, SaveButton } from './ui'
import { adminButton, adminInput } from './styles'

export type AdminLesson = {
  id: string
  title: string
  description: string
  durationSeconds: number
  blockCount: number
  videoCount: number
  isFreePreview: boolean
}

const initialState: AdminFormState = { ok: false, message: '' }

function LessonForm({
  courseId,
  lesson,
  onDone,
}: {
  courseId: string
  lesson?: AdminLesson
  onDone: () => void
}) {
  const [state, action] = useActionState(saveLesson, initialState)

  useEffect(() => {
    if (state.ok && lesson) onDone()
  }, [state, lesson, onDone])

  const value = (key: string, saved: string) => state.values?.[key] ?? saved
  const err = (key: string) => state.errors?.[key]
  const prefix = lesson ? `l-${lesson.id}` : 'l-new'

  return (
    <form action={action} className="space-y-4 border border-champagne/60 bg-sand/60 p-4 sm:p-5">
      <input type="hidden" name="courseId" value={courseId} />
      {lesson && <input type="hidden" name="lessonId" value={lesson.id} />}

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <AdminField id={`${prefix}-title`} label="Titlul lecției" error={err('title')}>
          <input
            id={`${prefix}-title`}
            name="title"
            required
            defaultValue={value('title', lesson?.title ?? '')}
            className={adminInput}
          />
        </AdminField>
        <AdminField id={`${prefix}-duration`} label="Durată (minute)" error={err('durationMinutes')}>
          <input
            id={`${prefix}-duration`}
            name="durationMinutes"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={value('durationMinutes', lesson ? String(Math.round(lesson.durationSeconds / 60)) : '')}
            required
            className={adminInput}
          />
        </AdminField>
      </div>

      <AdminField
        id={`${prefix}-description`}
        label="Descriere scurtă"
        hint="Apare sub titlul lecției. Videoclipurile și textul lecției se adaugă din „Conținut”."
      >
        <textarea
          id={`${prefix}-description`}
          name="description"
          rows={2}
          defaultValue={value('description', lesson?.description ?? '')}
          className={adminInput}
        />
      </AdminField>


      <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink">
        <input
          type="checkbox"
          name="isFreePreview"
          defaultChecked={lesson?.isFreePreview ?? false}
          className="size-4 accent-bronze"
        />
        Lecție de probă gratuită
        <span className="text-[13px] text-stone">— vizibilă fără cumpărare</span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton label={lesson ? 'Salvează lecția' : 'Adaugă lecția'} />
        <button type="button" onClick={onDone} className={adminButton.secondary}>
          {lesson ? 'Anulează' : 'Închide'}
        </button>
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  )
}

function MoveButtons({ lessonId, first, last }: { lessonId: string; first: boolean; last: boolean }) {
  const [pending, startTransition] = useTransition()
  const move = (direction: 'up' | 'down') => startTransition(() => moveLesson(lessonId, direction))

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => move('up')}
        disabled={first || pending}
        aria-label="Mută mai sus"
        className={adminButton.small}
      >
        <ArrowUp className="size-3.5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => move('down')}
        disabled={last || pending}
        aria-label="Mută mai jos"
        className={adminButton.small}
      >
        <ArrowDown className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  )
}

export function LessonsManager({ courseId, lessons }: { courseId: string; lessons: AdminLesson[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const totalSeconds = lessons.reduce((sum, l) => sum + l.durationSeconds, 0)
  const close = () => setEditing(null)

  return (
    <AdminCard
      title="Lecții"
      description={
        lessons.length
          ? `${lessonsLabel(lessons.length)} · ${formatDuration(totalSeconds)} în total`
          : 'Cursul nu are încă lecții.'
      }
    >
      <ol className="space-y-3">
        {lessons.map((lesson, i) => (
          <li key={lesson.id}>
            {editing === lesson.id ? (
              <LessonForm courseId={courseId} lesson={lesson} onDone={close} />
            ) : (
              <div className="flex flex-col gap-3 border border-champagne/20 px-4 py-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="w-6 shrink-0 font-mono text-[13px] leading-6 text-bronze">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] leading-6 text-ink">{lesson.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-stone">
                      <span className="font-mono">{formatDuration(lesson.durationSeconds)}</span>
                      {lesson.videoCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <Video className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                          {lesson.videoCount === 1 ? '1 video' : `${lesson.videoCount} video`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <VideoOff className="size-3.5" strokeWidth={1.5} aria-hidden="true" /> fără video
                        </span>
                      )}
                      <span>{lesson.blockCount === 1 ? '1 bloc' : `${lesson.blockCount} blocuri`}</span>
                      {lesson.isFreePreview && (
                        <span className="bg-ink px-1.5 py-0.5 text-[12px] text-champagne-light">
                          Probă gratuită
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <MoveButtons lessonId={lesson.id} first={i === 0} last={i === lessons.length - 1} />
                  <Link href={`/admin/cursuri/${courseId}/lectii/${lesson.id}`} className={adminButton.small}>
                    <LayoutList className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    Conținut
                  </Link>
                  <button type="button" onClick={() => setEditing(lesson.id)} className={adminButton.small}>
                    <Pencil className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    Editează
                  </button>
                  <ConfirmButton
                    action={() => deleteLesson(lesson.id)}
                    label={
                      <>
                        <Trash2 className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span className="sr-only">Șterge lecția {lesson.title}</span>
                      </>
                    }
                    confirmLabel="Șterge"
                    className={adminButton.small + ' text-red-700 hover:border-red-600'}
                  />
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className={lessons.length ? 'mt-4' : ''}>
        {editing === 'new' ? (
          <LessonForm courseId={courseId} onDone={close} />
        ) : (
          <button type="button" onClick={() => setEditing('new')} className={adminButton.secondary}>
            <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Adaugă lecție
          </button>
        )}
      </div>
    </AdminCard>
  )
}
