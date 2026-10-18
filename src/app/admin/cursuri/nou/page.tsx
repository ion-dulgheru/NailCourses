import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import { listPublicImages } from '@/lib/images'
import { getCourseCategories } from '@/lib/courses'
import { getStorageInfo } from '@/lib/storage'
import { AdminPageHeader } from '@/components/admin/ui'
import { CourseForm } from '@/components/admin/course-form'

export const metadata: Metadata = { title: 'Curs nou' }

export default async function NewCoursePage() {
  await requireAdminPage('/admin/cursuri/nou')
  const [images, categories, storage] = await Promise.all([listPublicImages(), getCourseCategories(), getStorageInfo()])

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={<Link href="/admin/cursuri" className="hover:text-ink">← Cursuri</Link>}
        title="Curs nou"
        description="Patru pași scurți. După creare adaugi lecțiile și conținutul lor."
      />
      <CourseForm images={images} categories={categories} storage={storage} />
    </div>
  )
}
