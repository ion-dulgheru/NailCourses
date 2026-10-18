import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Cifre: prețuri, durate, numerotarea cursurilor și a lecțiilor
const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  // Linkurile absolute din metadate (imagini Open Graph) pornesc de la adresa site-ului.
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: 'GJ Nail Academy — Cursuri online de manichiură',
  description:
    'Cursuri online de manichiură profesională: de la bazele tehnicii până la nail art avansat. Învață pas cu pas, în ritmul tău, de la un profesionist.',
}

export const viewport: Viewport = {
  themeColor: '#16110d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ro"
      className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} bg-background`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
