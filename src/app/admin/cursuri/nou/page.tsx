import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import { listPublicImages } from '@/lib/images'
import { AdminPageHeader } from '@/components/admin/ui'
import { CourseForm } from '@/components/admin/course-form'

export const metadata: Metadata = { title: 'Curs nou' }

export default async function NewCoursePage() {
  await requireAdminPage('/admin/cursuri/nou')
  const images = await listPublicImages()

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={<Link href="/admin/cursuri" className="hover:text-ink">← Cursuri</Link>}
        title="Curs nou"
        description="După creare poți adăuga lecțiile. Cursul rămâne ciornă până îl publici."
      />
      <CourseForm images={images} />
    </div>
  )
}
