import { parseVideoSource } from '@/lib/video'
import { LessonVideo } from './lesson-video'

export type LessonBlockData = { id: string; type: 'titlu' | 'text' | 'video'; text: string; videoKey: string | null }

// Textul unui bloc: un rând gol separă paragrafele; rândurile care încep cu „- ” formează o listă.
function RichText({ text }: { text: string }) {
  const chunks = text.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean)
  return (
    <div className="max-w-[46rem] space-y-4 text-[15px] leading-[1.75] text-ivory/75 sm:text-[16px]">
      {chunks.map((chunk, i) => {
        const lines = chunk.split('\n').map((l) => l.trim())
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-champagne">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {chunk}
          </p>
        )
      })}
    </div>
  )
}

export function LessonBlock({ block, watermark, lessonTitle }: { block: LessonBlockData; watermark: string; lessonTitle: string }) {
  if (block.type === 'titlu') {
    return <h2 className="font-display text-[26px] leading-tight text-ivory sm:text-[30px]">{block.text}</h2>
  }
  if (block.type === 'text') return <RichText text={block.text} />

  const source = parseVideoSource(block.videoKey)
  if (!source) return null
  return (
    <LessonVideo
      blockId={block.id}
      source={source}
      watermark={watermark}
      caption={block.text || undefined}
      title={block.text || lessonTitle}
    />
  )
}
