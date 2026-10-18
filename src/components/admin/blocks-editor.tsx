'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { ArrowDown, ArrowUp, Heading, Pencil, Text, Trash2, Video } from 'lucide-react'
import { deleteBlock, moveBlock, saveBlock, type AdminFormState } from '@/lib/actions/admin.actions'
import { parseVideoSource } from '@/lib/video'
import { cn } from '@/lib/utils'
import { AdminCard, AdminField, ConfirmButton, FormMessage, SaveButton } from './ui'
import { adminButton, adminInput } from './styles'
import { VideoUpload, type StorageUsage } from './video-upload'

export type BlockType = 'titlu' | 'text' | 'video'
export type AdminBlock = { id: string; type: BlockType; text: string; videoKey: string | null }

const TYPES: Record<BlockType, { label: string; add: string; icon: typeof Heading }> = {
  titlu: { label: 'Titlu', add: 'Adaugă titlu', icon: Heading },
  text: { label: 'Text', add: 'Adaugă text', icon: Text },
  video: { label: 'Video', add: 'Adaugă video', icon: Video },
}

const initialState: AdminFormState = { ok: false, message: '' }

function BlockForm({
  lessonId,
  type,
  block,
  storage,
  onDone,
}: {
  lessonId: string
  type: BlockType
  block?: AdminBlock
  storage: StorageUsage | null
  onDone: () => void
}) {
  const [state, action] = useActionState(saveBlock, initialState)
  const videoKeyRef = useRef<HTMLInputElement>(null)

  // După salvare, formularul se închide (blocul nou apare în listă).
  useEffect(() => {
    if (state.ok) onDone()
  }, [state, onDone])

  const value = (key: string, saved: string) => state.values?.[key] ?? saved
  const err = (key: string) => state.errors?.[key]
  const invalid = (key: string) => (err(key) ? { 'aria-invalid': true, 'aria-describedby': `${prefix}-${key}-error` } : {})
  const prefix = block ? `b-${block.id}` : `b-new-${type}`
  const Icon = TYPES[type].icon

  return (
    <form action={action} className="space-y-4 border border-champagne/60 bg-sand/60 p-4 sm:p-5">
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="type" value={type} />
      {block && <input type="hidden" name="blockId" value={block.id} />}

      <p className="flex items-center gap-2 text-[12px] font-medium text-bronze">
        <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {block ? `Editează ${TYPES[type].label.toLowerCase()}` : TYPES[type].add}
      </p>

      {type === 'titlu' && (
        <AdminField id={`${prefix}-text`} label="Titlu" error={err('text')}>
          <input
            id={`${prefix}-text`}
            name="text"
            required
            autoFocus
            maxLength={200}
            defaultValue={value('text', block?.text ?? '')}
            placeholder="ex: Pregătirea unghiei"
            className={adminInput}
            {...invalid('text')}
          />
        </AdminField>
      )}

      {type === 'text' && (
        <AdminField
          id={`${prefix}-text`}
          label="Text"
          hint="Un rând gol separă paragrafele. Un rând care începe cu „- ” devine punct de listă."
          error={err('text')}
        >
          <textarea
            id={`${prefix}-text`}
            name="text"
            rows={6}
            required
            autoFocus
            defaultValue={value('text', block?.text ?? '')}
            className={adminInput}
            {...invalid('text')}
          />
        </AdminField>
      )}

      {type === 'video' && (
        <>
          <VideoUpload
            lessonId={lessonId}
            storage={storage}
            onUploaded={(key) => {
              if (videoKeyRef.current) videoKeyRef.current.value = key
            }}
          />
          <AdminField
            id={`${prefix}-videoKey`}
            label="Videoclip"
            hint="Se completează singur după încărcare. Poți scrie și numele unui fișier deja urcat în spațiul de stocare. Pentru lecțiile gratuite poți pune un link YouTube; atenție: un video YouTube poate fi văzut de oricine are linkul."
            error={err('videoKey')}
          >
            <input
              ref={videoKeyRef}
              id={`${prefix}-videoKey`}
              name="videoKey"
              required
              autoFocus
              defaultValue={value('videoKey', block?.videoKey ?? '')}
              placeholder="bazele/lectia-04.mp4 sau https://youtu.be/…"
              className={adminInput}
              {...invalid('videoKey')}
            />
          </AdminField>
          <AdminField id={`${prefix}-text`} label="Legendă (opțional)" hint="Apare sub videoclip." error={err('text')}>
            <input
              id={`${prefix}-text`}
              name="text"
              maxLength={300}
              defaultValue={value('text', block?.text ?? '')}
              className={adminInput}
            />
          </AdminField>
        </>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton label={block ? 'Salvează' : 'Adaugă'} />
        <button type="button" onClick={onDone} className={adminButton.secondary}>
          Anulează
        </button>
        <div className="flex-1">
          <FormMessage state={state.ok ? initialState : state} />
        </div>
      </div>
    </form>
  )
}

function BlockPreview({ block }: { block: AdminBlock }) {
  if (block.type === 'titlu') {
    return <p className="font-display text-[22px] leading-snug text-ink">{block.text}</p>
  }
  if (block.type === 'text') {
    return <p className="line-clamp-3 whitespace-pre-line text-[14px] leading-[1.6] text-stone">{block.text}</p>
  }

  const source = parseVideoSource(block.videoKey)
  return (
    <div className="min-w-0 text-[14px]">
      <p className="truncate text-ink">{block.videoKey}</p>
      <p className="mt-0.5 text-[12px] text-stone">
        {source?.kind === 'youtube' ? 'YouTube · public' : 'Fișier din spațiul de stocare · protejat'}
        {block.text && ` · ${block.text}`}
      </p>
    </div>
  )
}

function MoveButtons({ blockId, first, last }: { blockId: string; first: boolean; last: boolean }) {
  const [pending, startTransition] = useTransition()
  const move = (direction: 'up' | 'down') => startTransition(() => moveBlock(blockId, direction))

  return (
    <div className="flex gap-1">
      <button type="button" onClick={() => move('up')} disabled={first || pending} aria-label="Mută mai sus" className={adminButton.small}>
        <ArrowUp className="size-3.5" strokeWidth={1.75} />
      </button>
      <button type="button" onClick={() => move('down')} disabled={last || pending} aria-label="Mută mai jos" className={adminButton.small}>
        <ArrowDown className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  )
}

export function BlocksEditor({
  lessonId,
  blocks,
  storage,
}: {
  lessonId: string
  blocks: AdminBlock[]
  storage: StorageUsage | null
}) {
  // `null` = nimic deschis; id-ul unui bloc = editare; tip = bloc nou de acel tip.
  const [open, setOpen] = useState<string | null>(null)
  const close = () => setOpen(null)

  return (
    <AdminCard
      title="Conținutul lecției"
      description="Compune lecția din blocuri, în ordinea în care le vede eleva. O lecție poate avea mai multe videoclipuri."
    >
      {blocks.length === 0 && open === null && (
        <p className="mb-5 border border-dashed border-champagne/20 px-5 py-8 text-center text-[14px] text-stone">
          Lecția nu are încă conținut. Începe cu un video sau un titlu.
        </p>
      )}

      <ol className="space-y-3">
        {blocks.map((block, i) => {
          const { icon: Icon, label } = TYPES[block.type]
          return (
            <li key={block.id}>
              {open === block.id ? (
                <BlockForm lessonId={lessonId} type={block.type} block={block} storage={storage} onDone={close} />
              ) : (
                <div className="flex flex-col gap-3 border border-champagne/20 px-4 py-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 inline-flex shrink-0 items-center gap-1.5 px-2 py-1 text-[12px] font-medium',
                        block.type === 'video' ? 'bg-ink text-champagne-light' : 'bg-sand text-stone',
                      )}
                    >
                      <Icon className="size-3" strokeWidth={1.75} aria-hidden="true" />
                      {label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <BlockPreview block={block} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <MoveButtons blockId={block.id} first={i === 0} last={i === blocks.length - 1} />
                    <button type="button" onClick={() => setOpen(block.id)} className={adminButton.small}>
                      <Pencil className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                      Editează
                    </button>
                    <ConfirmButton
                      action={() => deleteBlock(block.id)}
                      label={
                        <>
                          <Trash2 className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                          <span className="sr-only">Șterge blocul</span>
                        </>
                      }
                      confirmLabel={block.type === 'video' ? 'Șterge și videoclipul' : 'Șterge'}
                      className={adminButton.small + ' text-red-700 hover:border-red-600'}
                    />
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className={blocks.length ? 'mt-4' : ''}>
        {open === 'titlu' || open === 'text' || open === 'video' ? (
          <BlockForm lessonId={lessonId} type={open} storage={storage} onDone={close} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TYPES) as BlockType[]).map((type) => {
              const { icon: Icon, add } = TYPES[type]
              return (
                <button key={type} type="button" onClick={() => setOpen(type)} className={adminButton.secondary}>
                  <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  {add}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </AdminCard>
  )
}
