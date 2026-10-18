'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { requestVideoUpload } from '@/lib/actions/admin.actions'
import { adminButton } from './styles'

export type StorageUsage = { used: number; limit: number }

type UploadState =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number }
  | { status: 'done'; key: string }
  | { status: 'error'; message: string }

// Sub 1 GB în MB, altfel câteva sute de MB ar apărea ca „0 GB”.
const formatSize = (bytes: number) =>
  bytes < 1024 ** 3
    ? `${Math.round(bytes / 1024 ** 2).toLocaleString('ro-RO')} MB`
    : `${(bytes / 1024 ** 3).toLocaleString('ro-RO', { maximumFractionDigits: 2 })} GB`

// Urcă un videoclip direct din browser în R2. Serverul verifică întâi limita de 10 GB și dă un link
// semnat; la final, cheia fișierului e pusă în câmpul „Videoclip” prin `onUploaded`.
export function VideoUpload({
  lessonId,
  storage,
  onUploaded,
}: {
  lessonId: string
  storage: StorageUsage | null
  onUploaded: (key: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>({ status: 'idle' })
  const [used, setUsed] = useState(storage?.used ?? 0)
  const uploading = state.status === 'uploading'

  // Închiderea paginii în timpul urcării ar pierde fișierul: browserul cere confirmare.
  useEffect(() => {
    if (!uploading) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [uploading])

  if (!storage) return null
  const full = used >= storage.limit

  const upload = async (file: File) => {
    setState({ status: 'uploading', progress: 0 })
    let result
    try {
      result = await requestVideoUpload({ lessonId, fileName: file.name, size: file.size, contentType: file.type })
    } catch {
      return setState({ status: 'error', message: 'Nu am putut pregăti încărcarea. Încearcă din nou.' })
    }
    if (!result.ok) return setState({ status: 'error', message: result.message })

    const { url, key } = result
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setState({ status: 'uploading', progress: Math.round((e.loaded / e.total) * 100) })
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUsed((u) => u + file.size)
        setState({ status: 'done', key })
        onUploaded(key)
      } else {
        setState({ status: 'error', message: 'Încărcarea a eșuat. Încearcă din nou.' })
      }
    }
    xhr.onerror = () =>
      setState({ status: 'error', message: 'Încărcarea a eșuat (conexiune sau setări CORS în R2). Încearcă din nou.' })
    xhr.send(file)
  }

  return (
    <div className="space-y-2 border border-dashed border-champagne/30 bg-ivory px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) void upload(file)
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || full}
          className={adminButton.secondary}
        >
          <Upload className="size-4" strokeWidth={1.5} aria-hidden="true" />
          {uploading ? `Se încarcă… ${state.progress}%` : 'Încarcă video de pe calculator'}
        </button>
        <span className="text-[12px] text-stone">
          Spațiu folosit: {formatSize(used)} din {formatSize(storage.limit)}
        </span>
      </div>

      {uploading && (
        <div className="h-1.5 w-full bg-sand" role="progressbar" aria-valuenow={state.progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-bronze transition-[width]" style={{ width: `${state.progress}%` }} />
        </div>
      )}

      {full ? (
        <p role="alert" className="text-[13px] font-medium text-red-700">
          Nu poți adăuga video: spațiul de stocare de 10 GB este plin. Contactează creatorul site-ului.
        </p>
      ) : state.status === 'error' ? (
        <p role="alert" className="text-[13px] text-red-700">
          {state.message}
        </p>
      ) : state.status === 'done' ? (
        <p role="status" className="text-[13px] text-emerald-700">
          Videoclipul a fost încărcat. Apasă „Salvează” ca să-l adaugi în lecție.
        </p>
      ) : null}
    </div>
  )
}
