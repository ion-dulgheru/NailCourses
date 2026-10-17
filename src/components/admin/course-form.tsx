'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { saveCourse, type AdminFormState } from '@/lib/actions/admin.actions'
import { AdminCard, AdminField, FormMessage, SaveButton } from './ui'
import { adminInput } from './styles'

export type CourseFormData = {
  id: string
  title: string
  slug: string
  category: string
  shortDescription: string
  longDescription: string
  level: string
  priceMdl: number
  coverImage: string
  coverAlt: string
  whatYouLearn: string[]
  forWho: string[]
  materials: string[]
  status: string
}

const initialState: AdminFormState = { ok: false, message: '' }

export function CourseForm({ course, images }: { course?: CourseFormData; images: string[] }) {
  const [state, action] = useActionState(saveCourse, initialState)

  // Valoarea afișată: ce a trimis adminul (după o eroare) sau ce e salvat.
  const value = (key: keyof CourseFormData) => {
    if (state.values && key in state.values) return state.values[key]
    const saved = course?.[key]
    return Array.isArray(saved) ? saved.join('\n') : saved === undefined ? '' : String(saved)
  }
  const err = (key: string) => state.errors?.[key]
  const invalid = (key: string) => (err(key) ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {})

  const [cover, setCover] = useState(value('coverImage') || images[0] || '')

  return (
    <form action={action} className="space-y-6">
      {course && <input type="hidden" name="id" value={course.id} />}

      <AdminCard title="Prezentare" description="Ce vede vizitatorul în catalog și în antetul paginii cursului.">
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField id="title" label="Titlu" error={err('title')} className="sm:col-span-2">
            <input id="title" name="title" defaultValue={value('title')} required className={adminInput} {...invalid('title')} />
          </AdminField>

          <AdminField
            id="slug"
            label="Adresa paginii"
            hint="Se completează automat din titlu dacă o lași goală."
            error={err('slug')}
          >
            <div className="flex">
              <span className="flex items-center border border-r-0 border-line bg-sand px-3 text-[13px] text-stone">
                /cursuri/
              </span>
              <input id="slug" name="slug" defaultValue={value('slug')} placeholder="bazele-manichiurii" className={adminInput} {...invalid('slug')} />
            </div>
          </AdminField>

          <AdminField id="category" label="Categorie" hint="Ex: Curs fundamente, Curs gel" error={err('category')}>
            <input id="category" name="category" defaultValue={value('category')} className={adminInput} />
          </AdminField>

          <AdminField
            id="shortDescription"
            label="Promisiunea cursului (o frază)"
            error={err('shortDescription')}
            className="sm:col-span-2"
          >
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              defaultValue={value('shortDescription')}
              required
              className={adminInput}
              {...invalid('shortDescription')}
            />
          </AdminField>

          <AdminField
            id="longDescription"
            label="Descriere detaliată"
            hint="Apare lângă „Ce vei învăța” pe pagina cursului."
            className="sm:col-span-2"
          >
            <textarea id="longDescription" name="longDescription" rows={4} defaultValue={value('longDescription')} className={adminInput} />
          </AdminField>

          <AdminField id="level" label="Nivel" error={err('level')}>
            <select id="level" name="level" defaultValue={value('level') || 'incepator'} className={adminInput}>
              <option value="incepator">Începător</option>
              <option value="intermediar">Intermediar</option>
              <option value="avansat">Avansat</option>
            </select>
          </AdminField>

          <AdminField id="priceMdl" label="Preț (MDL)" error={err('priceMdl')}>
            <input
              id="priceMdl"
              name="priceMdl"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={value('priceMdl')}
              required
              className={adminInput}
              {...invalid('priceMdl')}
            />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard title="Imagine de copertă" description="Imaginile disponibile sunt cele din folderul public/images.">
        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          <div className="relative aspect-[11/10] overflow-hidden border border-line bg-sand">
            {cover && <Image src={cover} alt="" fill sizes="160px" className="object-cover" />}
          </div>
          <div className="space-y-5">
            <AdminField id="coverImage" label="Imagine" error={err('coverImage')}>
              <select
                id="coverImage"
                name="coverImage"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className={adminInput}
              >
                {images.map((src) => (
                  <option key={src} value={src}>
                    {src.replace('/images/', '')}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField id="coverAlt" label="Descrierea imaginii" hint="Pentru cititoarele de ecran și Google. Ex: Manichiură nude, unghii ovale.">
              <input id="coverAlt" name="coverAlt" defaultValue={value('coverAlt')} className={adminInput} />
            </AdminField>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Detalii pe pagina cursului" description="Un punct pe fiecare rând.">
        <div className="grid gap-5 lg:grid-cols-3">
          <AdminField id="whatYouLearn" label="Ce vei învăța" hint="5–8 puncte concrete.">
            <textarea id="whatYouLearn" name="whatYouLearn" rows={8} defaultValue={value('whatYouLearn')} className={adminInput} />
          </AdminField>
          <AdminField id="forWho" label="Pentru cine e">
            <textarea id="forWho" name="forWho" rows={8} defaultValue={value('forWho')} className={adminInput} />
          </AdminField>
          <AdminField id="materials" label="De ce ai nevoie">
            <textarea id="materials" name="materials" rows={8} defaultValue={value('materials')} className={adminInput} />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard title="Vizibilitate">
        <fieldset className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <legend className="sr-only">Starea cursului</legend>
          {[
            { value: 'ciorna', label: 'Ciornă', hint: 'nu apare pe site' },
            { value: 'publicat', label: 'Publicat', hint: 'vizibil în catalog' },
          ].map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink">
              <input
                type="radio"
                name="status"
                value={opt.value}
                defaultChecked={(value('status') || 'ciorna') === opt.value}
                className="size-4 accent-bronze"
              />
              {opt.label}
              <span className="text-[13px] text-stone">— {opt.hint}</span>
            </label>
          ))}
        </fieldset>
      </AdminCard>

      <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-line bg-sand/95 px-5 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:px-0">
        <div className="min-h-[1px] flex-1">
          <FormMessage state={state} />
        </div>
        <SaveButton label={course ? 'Salvează modificările' : 'Creează cursul'} />
      </div>
    </form>
  )
}
