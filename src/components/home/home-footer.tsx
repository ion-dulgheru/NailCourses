import Link from 'next/link'
import { Wordmark, container } from './primitives'
import { getSettings, telHref } from '@/lib/settings'

const navLinks = [
  { label: 'Cursuri', href: '/cursuri' },
  { label: 'Despre', href: '/despre' },
  { label: 'Întrebări frecvente', href: '/intrebari-frecvente' },
  { label: 'Contact', href: '/contact' },
]

const legalLinks = [
  { label: 'Termeni și condiții', href: '/termeni-si-conditii' },
  { label: 'Politica de rambursare', href: '/politica-de-rambursare' },
  { label: 'Confidențialitate', href: '/politica-de-confidentialitate' },
]

const socialIcons = [
  {
    key: 'facebook_url',
    label: 'Facebook',
    path: 'M13.5 21.9v-7.7h2.6l.4-3h-3V9.3c0-.9.2-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.7h3.1z',
  },
  {
    key: 'instagram_url',
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
  },
  {
    key: 'tiktok_url',
    label: 'TikTok',
    path: 'M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z',
  },
] as const

// Banca cere afișarea sistemelor de plată acceptate. TODO: înlocuiește cu logo-urile oficiale primite de la maib.
const paymentBadges = ['Visa', 'Mastercard', 'maib']

const linkClass = 'text-ivory/80 transition-colors hover:text-champagne-light'

export async function HomeFooter() {
  const settings = await getSettings()
  const socials = socialIcons.filter((s) => settings[s.key])
  const company = [
    settings.firma_denumire,
    settings.firma_idno && `IDNO ${settings.firma_idno}`,
    settings.firma_adresa,
  ].filter(Boolean)

  return (
    <footer className="bg-ink text-ivory">
      <div className={`${container} pt-12 pb-6 lg:pt-14`}>
        <div className="grid grid-cols-2 gap-10 text-[13px] sm:grid-cols-4 sm:gap-8">
          <div className="col-span-2 flex justify-center sm:col-span-1 sm:justify-start">
            <Wordmark stacked />
          </div>

          <nav aria-label="Navigație subsol">
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            {socials.length > 0 && (
              <ul className="flex gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={settings[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex size-7 items-center justify-center rounded-full bg-ivory text-ink transition-colors hover:bg-champagne"
                    >
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
                        <path d={s.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <address className="space-y-1.5 not-italic text-ivory/80">
              <p>
                <a href={telHref(settings.firma_telefon)} className={linkClass}>
                  {settings.firma_telefon}
                </a>
              </p>
              {settings.contact_email && (
                <p>
                  <a href={`mailto:${settings.contact_email}`} className={linkClass}>
                    {settings.contact_email}
                  </a>
                </p>
              )}
              <p>{settings.firma_adresa}</p>
            </address>
          </div>

          <div>
            <ul className="space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul aria-label="Metode de plată acceptate" className="mt-5 flex flex-wrap gap-1.5">
              {paymentBadges.map((b) => (
                <li key={b} className="border border-champagne/20 px-2 py-0.5 text-[12px] text-ivory/70">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-champagne/15 pt-5 text-[11px] text-ivory/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} GJ Nail Academy. Toate drepturile rezervate.</p>
          <p>{company.length > 0 ? company.join(' · ') : 'Academia online a GJ Nail Studio'}</p>
        </div>
      </div>
    </footer>
  )
}
