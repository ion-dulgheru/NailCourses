import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Imaginea afișată când linkul site-ului e distribuit (Facebook, WhatsApp, Telegram).
// Aceleași culori ca site-ul: negru #0c0b0a, auriu #c8aa6e. Fonturile trebuie să fie TTF statice
// (variantele variabile, ca Inter.ttf, opresc generarea imaginii).
export const alt = 'GJ Nail Academy — cursuri online de manichiură'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [cormorant, cormorantItalic, photo] = await Promise.all([
    readFile(join(process.cwd(), 'src/assets/fonts/CormorantGaramond-Light.ttf')),
    readFile(join(process.cwd(), 'src/assets/fonts/CormorantGaramond-LightItalic.ttf')),
    readFile(join(process.cwd(), 'public/images/hero-hands-face.jpg')),
  ])

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0c0b0a', color: '#ffffff', fontFamily: 'Cormorant' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 690, padding: '64px 0 64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontSize: 34 }}>
            <span style={{ fontStyle: 'italic' }}>GJ</span>
            <span style={{ fontSize: 20, letterSpacing: 4 }}>NAIL ACADEMY</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 80, lineHeight: 1 }}>Stăpânește arta unghiilor</div>
            <div style={{ fontStyle: 'italic', fontSize: 80, lineHeight: 1.05, color: '#c8aa6e' }}>
              impecabile
            </div>
            <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.3, color: 'rgba(255,255,255,0.7)', maxWidth: 540 }}>
              Cursuri video de manichiură, pas cu pas, cu certificat la final.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, padding: '48px 48px 48px 0' }}>
          <div style={{ display: 'flex', flex: 1, border: '1px solid rgba(200,170,110,0.2)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${photo.toString('base64')}`}
              alt=""
              width={462}
              height={534}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%' }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cormorant', data: cormorant, style: 'normal', weight: 300 },
        { name: 'Cormorant', data: cormorantItalic, style: 'italic', weight: 300 },
      ],
    },
  )
}
