'use client'

import { useActionState, useRef, useState } from 'react'
import Image from 'next/image'
import { AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { saveCourse, type AdminFormState } from '@/lib/actions/admin.actions'
import { slugify } from '@/lib/slug'
import { cn } from '@/lib/utils'
import { AdminCard, AdminField, FormMessage, SaveButton } from './ui'
import { adminButton, adminInput } from './styles'
import { FileUpload, type StorageUsage } from './file-upload'

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

// Pașii de la crearea unui curs. La editare aceleași secțiuni apar toate pe o singură pagină.
const STEPS = [
  { title: 'Bază', description: 'Cum se numește cursul, cui se adresează și cât costă.' },
  { title: 'Prezentare', description: 'Ce vede vizitatorul în catalog: imaginea și descrierea.' },
  { title: 'Detalii', description: 'Listele de pe pagina cursului. Le poți completa și mai târziu.' },
  { title: 'Verificare', description: 'Verifică ce ai scris, alege dacă îl publici și creează cursul.' },
]

// Pasul pe care stă fiecare câmp, ca la o eroare de la server să sărim direct la el.
const FIELD_STEP: Record<string, number> = {
  title: 0, category: 0, level: 0, priceMdl: 0,
  shortDescription: 1, longDescription: 1, coverImage: 1, coverAlt: 1,
  whatYouLearn: 2, forWho: 2, materials: 2,
  slug: 3, status: 3,
}

const LEVELS = [
  { value: 'incepator', label: 'Începător', hint: 'Fără experiență în manichiură' },
  { value: 'intermediar', label: 'Intermediar', hint: 'Știe bazele, vrea să avanseze' },
  { value: 'avansat', label: 'Avansat', hint: 'Tehnici complexe, pentru profesioniste' },
]

const LIST_FIELDS = [
  {
    name: 'whatYouLearn' as const,
    label: 'Ce vei învăța',
    hint: '5–8 rezultate concrete, câte unul pe rând.',
    placeholder: 'Să pregătești corect unghia\nSă aplici gelul fără să curgă\nSă lucrezi curat în zona cuticulei',
  },
  {
    name: 'forWho' as const,
    label: 'Pentru cine e',
    hint: 'Câte un tip de cursantă pe rând.',
    placeholder: 'Începătoare care vor să lucreze acasă\nManichiuriste care vor să-și reîmprospăteze tehnica',
  },
  {
    name: 'materials' as const,
    label: 'De ce ai nevoie',
    hint: 'Materialele și instrumentele, câte unul pe rând.',
    placeholder: 'Lampă UV/LED\nPile 180/240\nGel de bază și top',
  },
]

export function CourseForm({
  course,
  images,
  categories,
  storage,
}: {
  course?: CourseFormData
  images: string[]
  categories: string[]
  storage: StorageUsage | null
}) {
  const [state, action] = useActionState(saveCourse, initialState)
  const wizard = !course
  const formRef = useRef<HTMLFormElement>(null)

  // Valoarea afișată: ce a trimis adminul (după o eroare) sau ce e salvat.
  const value = (key: keyof CourseFormData) => {
    if (state.values && key in state.values) return state.values[key]
    const saved = course?.[key]
    return Array.isArray(saved) ? saved.join('\n') : saved === undefined ? '' : String(saved)
  }
  const err = (key: string) => state.errors?.[key]
  const invalid = (key: string) => (err(key) ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {})

  const [step, setStep] = useState(0)
  const [cover, setCover] = useState(value('coverImage'))
  const [coverError, setCoverError] = useState('')
  const [title, setTitle] = useState(value('title'))
  const [slug, setSlug] = useState(value('slug'))
  const [summary, setSummary] = useState<Record<string, string>>({})

  // La o eroare de la server, pasul cu primul câmp greșit se deschide singur.
  const [seenState, setSeenState] = useState(state)
  if (state !== seenState) {
    setSeenState(state)
    const firstError = Object.keys(state.errors ?? {})[0]
    if (wizard && firstError) setStep(FIELD_STEP[firstError] ?? 0)
  }

  const gallery = cover && !images.includes(cover) ? [cover, ...images] : images

  // Câmpurile obligatorii ale pasului curent trebuie completate înainte de „Continuă”.
  const validateStep = (index: number) => {
    const container = formRef.current?.querySelector(`[data-step="${index}"]`)
    const fields = container?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select',
    )
    const firstInvalid = Array.from(fields ?? []).find((f) => !f.checkValidity())
    if (firstInvalid) {
      firstInvalid.reportValidity()
      return false
    }
    if (index === 1 && !cover) {
      setCoverError('Alege o imagine de copertă sau încarcă una.')
      return false
    }
    return true
  }

  const goTo = (index: number) => {
    if (index === 3 && formRef.current) {
      const data = new FormData(formRef.current)
      setSummary(Object.fromEntries(Array.from(data.entries()).map(([k, v]) => [k, String(v)])))
    }
    setStep(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => {
    if (validateStep(step)) goTo(step + 1)
  }

  const stepProps = (index: number) => ({
    'data-step': index,
    hidden: wizard && step !== index,
    className: 'space-y-6',
  })

  const pageSlug = slugify(slug || title)

  return (
    <form
      ref={formRef}
      action={action}
      // La creare, fiecare pas se verifică la „Continuă”; validarea browserului ar bloca trimiterea
      // fără mesaj vizibil pentru un câmp dintr-un pas ascuns. Serverul verifică oricum totul.
      noValidate={wizard}
      className="space-y-6"
      onKeyDown={(e) => {
        // Enter într-un câmp nu trimite formularul la jumătate: trece la pasul următor.
        if (wizard && step < 3 && e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
          e.preventDefault()
          next()
        }
      }}
    >
      {course && <input type="hidden" name="id" value={course.id} />}
      <input type="hidden" name="coverImage" value={cover} />

      {wizard && (
        <nav aria-label="Pașii creării cursului" className="border border-champagne/20 bg-ivory px-5 py-4 sm:px-6">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {STEPS.map((s, i) => {
              const done = i < step
              return (
                <li key={s.title} className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={i > step}
                    onClick={() => goTo(i)}
                    aria-current={i === step ? 'step' : undefined}
                    className="flex items-center gap-2 text-[13px] disabled:cursor-default"
                  >
                    <span
                      className={cn(
                        'flex size-7 items-center justify-center rounded-full border text-[12px] font-medium',
                        i === step && 'border-ink bg-ink text-ivory',
                        done && 'border-bronze bg-bronze text-ivory',
                        i > step && 'border-champagne/40 text-stone',
                      )}
                    >
                      {done ? <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" /> : i + 1}
                    </span>
                    <span className={cn(i === step ? 'font-medium text-ink' : 'text-stone', done && 'hover:text-ink')}>
                      {s.title}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && <span aria-hidden="true" className="hidden h-px w-8 bg-champagne/40 sm:block" />}
                </li>
              )
            })}
          </ol>
          <p className="mt-3 text-[13px] text-stone">
            Pasul {step + 1} din {STEPS.length}: {STEPS[step].description}
          </p>
        </nav>
      )}

      {/* 1. Bază */}
      <div {...stepProps(0)}>
        <AdminCard title={wizard ? undefined : 'Bază'} description={wizard ? undefined : STEPS[0].description}>
          <div className="grid gap-6 sm:grid-cols-2">
            <AdminField
              id="title"
              label="Titlul cursului"
              hint="Scurt și clar, cum l-ar căuta o cursantă. Ex: Manichiură cu gel pentru începătoare"
              error={err('title')}
              className="sm:col-span-2"
            >
              <input
                id="title"
                name="title"
                defaultValue={value('title')}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={120}
                autoFocus={wizard}
                className={adminInput}
                {...invalid('title')}
              />
            </AdminField>

            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-[13px] font-medium text-ink">Nivel</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {LEVELS.map((level) => (
                  <label key={level.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      value={level.value}
                      defaultChecked={(value('level') || 'incepator') === level.value}
                      className="peer sr-only"
                    />
                    <span className="block h-full border border-champagne/30 bg-ivory px-4 py-3 transition-colors peer-checked:border-bronze peer-checked:bg-sand peer-focus-visible:ring-2 peer-focus-visible:ring-bronze hover:border-champagne">
                      <span className="block text-[14px] font-medium text-ink">{level.label}</span>
                      <span className="mt-0.5 block text-[12px] text-stone">{level.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <AdminField id="priceMdl" label="Preț" hint="În lei, fără zecimale." error={err('priceMdl')}>
              <div className="flex">
                <input
                  id="priceMdl"
                  name="priceMdl"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  defaultValue={value('priceMdl')}
                  required
                  placeholder="1200"
                  className={adminInput}
                  {...invalid('priceMdl')}
                />
                <span className="flex items-center border border-l-0 border-champagne/20 bg-sand px-3 text-[13px] text-stone">
                  MDL
                </span>
              </div>
            </AdminField>

            <AdminField
              id="category"
              label="Categorie (opțional)"
              hint="Apare deasupra titlului. Alege una existentă sau scrie alta."
              error={err('category')}
            >
              <input
                id="category"
                name="category"
                list="course-categories"
                defaultValue={value('category')}
                placeholder="Ex: Curs gel"
                maxLength={60}
                className={adminInput}
              />
              <datalist id="course-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </AdminField>
          </div>
        </AdminCard>
      </div>

      {/* 2. Prezentare */}
      <div {...stepProps(1)}>
        <AdminCard title={wizard ? undefined : 'Prezentare'} description={wizard ? undefined : STEPS[1].description}>
          <div className="space-y-6">
            <AdminField
              id="shortDescription"
              label="Promisiunea cursului"
              hint="O frază despre ce reușește cursanta la final. Apare în catalog, sub titlu. Ex: Înveți să faci o manichiură cu gel care ține 3 săptămâni."
              error={err('shortDescription')}
            >
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={2}
                defaultValue={value('shortDescription')}
                required
                minLength={10}
                maxLength={300}
                className={adminInput}
                {...invalid('shortDescription')}
              />
            </AdminField>

            <AdminField
              id="longDescription"
              label="Descriere detaliată (opțional)"
              hint="2–4 fraze pe pagina cursului: cum decurge, ce o deosebește, ce primește cursanta."
            >
              <textarea id="longDescription" name="longDescription" rows={4} defaultValue={value('longDescription')} className={adminInput} />
            </AdminField>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-ink">Imaginea de copertă</p>
              <p className="mb-3 text-[12px] text-stone">
                Apare în catalog și pe pagina cursului. Cel mai bine arată o poză orizontală, de minimum 1200 px lățime.
              </p>
              <FileUpload
                kind="coperta"
                storage={storage}
                doneHint="Este selectată mai jos."
                onUploaded={(key) => {
                  setCover(`/${key}`)
                  setCoverError('')
                }}
              />
              {gallery.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5" role="radiogroup" aria-label="Alege coperta">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      type="button"
                      role="radio"
                      aria-checked={cover === src}
                      aria-label={src.split('/').pop()}
                      onClick={() => {
                        setCover(src)
                        setCoverError('')
                      }}
                      className={cn(
                        'relative aspect-[11/10] overflow-hidden border-2 bg-sand transition-colors',
                        cover === src ? 'border-bronze' : 'border-transparent hover:border-champagne',
                      )}
                    >
                      <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                      {cover === src && (
                        <span className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-bronze text-ivory">
                          <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {(coverError || err('coverImage')) && (
                <p id="coverImage-error" role="alert" className="mt-2 text-[12px] text-red-700">
                  {coverError || err('coverImage')}
                </p>
              )}
            </div>

            <AdminField
              id="coverAlt"
              label="Ce se vede în imagine (opțional)"
              hint="O descriere scurtă, pentru Google și pentru persoanele cu deficiențe de vedere. Ex: Manichiură nude pe unghii ovale."
            >
              <input id="coverAlt" name="coverAlt" defaultValue={value('coverAlt')} maxLength={200} className={adminInput} />
            </AdminField>
          </div>
        </AdminCard>
      </div>

      {/* 3. Detalii */}
      <div {...stepProps(2)}>
        <AdminCard title={wizard ? undefined : 'Detalii pe pagina cursului'} description={wizard ? undefined : STEPS[2].description}>
          <div className="grid gap-6 lg:grid-cols-3">
            {LIST_FIELDS.map((f) => (
              <AdminField key={f.name} id={f.name} label={f.label} hint={f.hint}>
                <textarea
                  id={f.name}
                  name={f.name}
                  rows={8}
                  defaultValue={value(f.name)}
                  placeholder={f.placeholder}
                  className={adminInput}
                />
              </AdminField>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* 4. Verificare (la editare: adresă și vizibilitate) */}
      <div {...stepProps(3)}>
        {wizard && <CourseSummary summary={summary} cover={cover} onEdit={goTo} />}

        <AdminCard title="Adresă și vizibilitate">
          <div className="space-y-6">
            <AdminField
              id="slug"
              label="Adresa paginii"
              hint={`Se face automat din titlu. Pagina va fi: /cursuri/${pageSlug || '…'}`}
              error={err('slug')}
            >
              <div className="flex">
                <span className="flex items-center border border-r-0 border-champagne/20 bg-sand px-3 text-[13px] text-stone">
                  /cursuri/
                </span>
                <input
                  id="slug"
                  name="slug"
                  defaultValue={value('slug')}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={slugify(title) || 'bazele-manichiurii'}
                  className={adminInput}
                  {...invalid('slug')}
                />
              </div>
            </AdminField>

            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-ink">Vizibilitate</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: 'ciorna',
                    label: 'Ciornă',
                    hint: wizard ? 'Recomandat: nu apare pe site până adaugi lecțiile.' : 'Nu apare pe site.',
                  },
                  { value: 'publicat', label: 'Publicat', hint: 'Apare în catalog și poate fi cumpărat.' },
                ].map((opt) => (
                  <label key={opt.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      defaultChecked={(value('status') || 'ciorna') === opt.value}
                      className="peer sr-only"
                    />
                    <span className="block h-full border border-champagne/30 bg-ivory px-4 py-3 transition-colors peer-checked:border-bronze peer-checked:bg-sand peer-focus-visible:ring-2 peer-focus-visible:ring-bronze hover:border-champagne">
                      <span className="block text-[14px] font-medium text-ink">{opt.label}</span>
                      <span className="mt-0.5 block text-[12px] text-stone">{opt.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {wizard && (
              <p className="text-[13px] text-stone">
                După creare ajungi pe pagina cursului, unde adaugi lecțiile și conținutul lor (video, text, PDF).
              </p>
            )}
          </div>
        </AdminCard>
      </div>

      <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-champagne/20 bg-sand/95 px-5 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:px-0">
        <div className="min-h-[1px] flex-1">
          <FormMessage state={state} />
        </div>
        {wizard ? (
          <div className="flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => goTo(step - 1)} className={adminButton.secondary}>
                <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Înapoi
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className={adminButton.primary}>
                Continuă
                <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            ) : (
              <SaveButton label="Creează cursul" pendingLabel="Se creează…" />
            )}
          </div>
        ) : (
          <SaveButton label="Salvează modificările" />
        )}
      </div>
    </form>
  )
}

const LEVEL_LABEL: Record<string, string> = { incepator: 'Începător', intermediar: 'Intermediar', avansat: 'Avansat' }

// Rezumatul de la ultimul pas, cu ce lipsește încă (nu blochează crearea).
function CourseSummary({
  summary,
  cover,
  onEdit,
}: {
  summary: Record<string, string>
  cover: string
  onEdit: (step: number) => void
}) {
  const count = (key: string) => (summary[key] ?? '').split('\n').filter((l) => l.trim()).length
  const price = Number(summary.priceMdl || 0)

  const rows = [
    { label: 'Titlu', value: summary.title, step: 0 },
    { label: 'Nivel', value: LEVEL_LABEL[summary.level] ?? '', step: 0 },
    { label: 'Preț', value: price > 0 ? `${price.toLocaleString('ro-RO')} MDL` : 'Gratuit (0 MDL)', step: 0 },
    { label: 'Categorie', value: summary.category || '—', step: 0 },
    { label: 'Promisiune', value: summary.shortDescription, step: 1 },
    { label: 'Ce vei învăța', value: `${count('whatYouLearn')} puncte`, step: 2 },
  ]

  const warnings = [
    !summary.longDescription?.trim() && { text: 'Nu ai scris o descriere detaliată.', step: 1 },
    count('whatYouLearn') === 0 && { text: 'Lista „Ce vei învăța” e goală — e prima listă pe care o citesc vizitatorii.', step: 2 },
    price === 0 && { text: 'Prețul e 0: cursul va fi gratuit.', step: 0 },
  ].filter((w): w is { text: string; step: number } => Boolean(w))

  return (
    <AdminCard title="Verifică cursul">
      <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
        <div className="relative aspect-[11/10] overflow-hidden border border-champagne/20 bg-sand">
          {cover && <Image src={cover} alt="" fill sizes="160px" className="object-cover" />}
        </div>
        <dl className="divide-y divide-champagne/15 text-[14px]">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-4 py-2 first:pt-0">
              <dt className="w-32 shrink-0 text-stone">{row.label}</dt>
              <dd className="min-w-0 flex-1 text-ink">{row.value}</dd>
              <button type="button" onClick={() => onEdit(row.step)} className="shrink-0 text-[12px] text-bronze hover:text-ink">
                Modifică
              </button>
            </div>
          ))}
        </dl>
      </div>

      {warnings.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-champagne/15 pt-5">
          {warnings.map((w) => (
            <li key={w.text} className="flex items-start gap-2.5 text-[13px] text-amber-900">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" strokeWidth={1.5} aria-hidden="true" />
              <span className="flex-1">{w.text}</span>
              <button type="button" onClick={() => onEdit(w.step)} className="shrink-0 text-[12px] text-bronze hover:text-ink">
                Completează
              </button>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  )
}
