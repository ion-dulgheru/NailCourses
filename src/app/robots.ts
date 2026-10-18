import type { MetadataRoute } from 'next'

const SITE = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

// Zonele private (cont, lecții, plată, admin) nu au ce căuta în căutări.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/cont', '/cursurile-mele', '/checkout', '/certificate', '/parola-noua'],
    },
    sitemap: `${SITE}/sitemap.xml`,
  }
}
