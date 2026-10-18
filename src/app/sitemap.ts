import type { MetadataRoute } from 'next'
import { getPublishedCourses } from '@/lib/courses'

// Lista cursurilor se schimbă din admin; harta se regenerează cel mult o dată pe oră.
export const revalidate = 3600

const SITE = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getPublishedCourses()
  const pages = ['', '/cursuri', '/despre', '/intrebari-frecvente', '/contact']

  return [
    ...pages.map((path) => ({ url: `${SITE}${path}`, changeFrequency: 'weekly' as const, priority: path ? 0.7 : 1 })),
    ...courses.map((c) => ({ url: `${SITE}/cursuri/${c.slug}`, lastModified: c.updatedAt, priority: 0.9 })),
  ]
}
