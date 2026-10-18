// Clase pentru panoul de admin. Stau într-un fișier fără 'use client', ca să poată fi
// folosite și din componente de server (valorile exportate din module client nu ajung ca text).

export const adminInput =
  'block w-full border border-champagne/20 bg-ivory px-3.5 py-2.5 text-[15px] text-ink placeholder:text-stone/50 outline-none transition-colors hover:border-champagne focus:border-bronze focus:ring-1 focus:ring-bronze aria-[invalid=true]:border-red-600'

export const adminButton = {
  primary:
    'inline-flex h-10 items-center justify-center gap-2 bg-ink px-5 text-[13px] font-medium text-ivory transition-colors hover:bg-ink-soft disabled:opacity-60',
  secondary:
    'inline-flex h-10 items-center justify-center gap-2 border border-champagne/20 bg-ivory px-5 text-[13px] font-medium text-ink transition-colors hover:border-ink disabled:opacity-60',
  danger:
    'inline-flex h-10 items-center justify-center gap-2 border border-red-200 bg-ivory px-5 text-[13px] font-medium text-red-700 transition-colors hover:border-red-600 hover:bg-red-50 disabled:opacity-60',
  small:
    'inline-flex h-8 items-center justify-center gap-1.5 border border-champagne/20 bg-ivory px-3 text-[12px] text-ink transition-colors hover:border-ink disabled:opacity-40',
}
