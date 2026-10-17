'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Maximize, Minimize, PlayCircle } from 'lucide-react'
import { youtubeEmbedUrl, type VideoSource } from '@/lib/video'
import { Watermark } from './watermark'

type FileState = { status: 'loading' } | { status: 'ready'; url: string } | { status: 'unavailable' } | { status: 'error' }

// Player pentru un bloc video. Ecranul complet se aplică pe tot containerul (nu doar pe <video>),
// ca filigranul să rămână vizibil; din același motiv butonul nativ de ecran complet e ascuns.
export function LessonVideo({
  blockId,
  source,
  watermark,
  caption,
  title,
}: {
  blockId: string
  source: VideoSource
  watermark: string
  caption?: string
  title: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const resumeAt = useRef(0)
  const [file, setFile] = useState<FileState>({ status: 'loading' })
  const [fullscreen, setFullscreen] = useState(false)

  // Linkul semnat expiră în câteva minute: îl cerem la încărcare și din nou dacă redarea dă eroare.
  const loadUrl = useCallback(async () => {
    try {
      const res = await fetch(`/api/video/${blockId}`, { cache: 'no-store' })
      if (!res.ok) return setFile({ status: 'error' })
      const data: { url: string | null } = await res.json()
      setFile(data.url ? { status: 'ready', url: data.url } : { status: 'unavailable' })
    } catch {
      setFile({ status: 'error' })
    }
  }, [blockId])

  useEffect(() => {
    if (source.kind !== 'fisier') return
    // Cererea pornește după montare; starea se actualizează doar când vine răspunsul.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUrl()
  }, [source.kind, loadUrl])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) return void document.exitFullscreen()
    const container = containerRef.current
    if (container?.requestFullscreen && document.fullscreenEnabled) return void container.requestFullscreen()
    // iPhone nu permite ecran complet pe container, doar pe <video> (fără filigran în acel mod).
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    video?.webkitEnterFullscreen?.()
  }

  const onVideoError = () => {
    // Link expirat în timpul vizionării: luăm altul și continuăm de unde a rămas.
    resumeAt.current = videoRef.current?.currentTime ?? 0
    void loadUrl()
  }

  return (
    <figure>
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black sm:border sm:border-ivory/10 [&:fullscreen]:aspect-auto [&:fullscreen]:border-0"
      >
        {source.kind === 'youtube' ? (
          <iframe
            src={youtubeEmbedUrl(source.id)}
            title={title}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        ) : file.status === 'ready' ? (
          <video
            ref={videoRef}
            key={file.url}
            src={file.url}
            controls
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onLoadedMetadata={(e) => {
              if (resumeAt.current) e.currentTarget.currentTime = resumeAt.current
            }}
            onError={onVideoError}
            className="absolute inset-0 size-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            {file.status === 'loading' ? (
              <Loader2 className="size-10 animate-spin text-champagne/70" strokeWidth={1.2} aria-label="Se încarcă videoclipul" />
            ) : (
              <>
                <PlayCircle className="size-14 text-champagne/70" strokeWidth={0.75} aria-hidden="true" />
                <p className="max-w-xs text-[14px] leading-[1.6] text-ivory/60">
                  {file.status === 'unavailable'
                    ? 'Videoclipul va fi disponibil în curând.'
                    : 'Videoclipul nu s-a putut încărca. Reîncarcă pagina.'}
                </p>
              </>
            )}
          </div>
        )}

        <Watermark text={watermark} />

        {fullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 text-[12px] text-white"
          >
            <Minimize className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Ieși
          </button>
        )}
      </div>

      <figcaption className="flex items-start justify-between gap-4 px-5 pt-3 sm:px-0">
        <span className="text-[13px] leading-[1.5] text-ivory/55">{caption}</span>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex shrink-0 items-center gap-1.5 text-[12px] text-ivory/60 transition-colors hover:text-champagne-light"
        >
          <Maximize className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Ecran complet
        </button>
      </figcaption>
    </figure>
  )
}
