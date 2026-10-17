import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

// Link direct către PDF-ul generat pe server (/api/certificat/[cod]).
export function DownloadCertificate({ code, className }: { code: string; className?: string }) {
  return (
    <a
      href={`/api/certificat/${code}`}
      download={`certificat-${code}.pdf`}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 bg-gold-metal px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:brightness-110',
        className,
      )}
    >
      <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
      Descarcă PDF
    </a>
  )
}
