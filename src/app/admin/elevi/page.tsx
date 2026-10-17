import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { requireAdminPage } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { AdminPageHeader } from '@/components/admin/ui'
import { adminButton, adminInput } from '@/components/admin/styles'

export const metadata: Metadata = { title: 'Elevi' }

const PAGE_SIZE = 50
const dateFormat = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdminPage('/admin/elevi')

  const q = ((await searchParams).q ?? '').trim().slice(0, 100)
  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' as const } },
          { name: { contains: q, mode: 'insensitive' as const } },
          { surname: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Oameni"
        title="Elevi"
        description="Deschide un elev ca să-i acorzi sau să-i retragi accesul la cursuri."
      />

      <form role="search" className="flex gap-2">
        <label htmlFor="q" className="sr-only">
          Caută după nume sau email
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone" strokeWidth={1.5} aria-hidden="true" />
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Caută după nume sau email" className={`${adminInput} pl-9`} />
        </div>
        <button type="submit" className={adminButton.primary}>
          Caută
        </button>
      </form>

      <p className="text-[13px] text-stone">
        {q
          ? `${total} ${total === 1 ? 'rezultat' : 'rezultate'} pentru „${q}”`
          : `${total} ${total === 1 ? 'cont' : 'conturi'}`}
        {total > PAGE_SIZE && ` · se afișează primele ${PAGE_SIZE}`}
      </p>

      {users.length === 0 ? (
        <div className="border border-dashed border-line bg-ivory px-6 py-12 text-center text-[14px] text-stone">
          {q ? 'Niciun cont nu se potrivește căutării.' : 'Încă nu s-a înregistrat nimeni.'}
        </div>
      ) : (
        <div className="overflow-x-auto border border-line bg-ivory">
          <table className="w-full min-w-[620px] text-left text-[14px]">
            <thead className="border-b border-line bg-sand/60 text-[11px] uppercase tracking-[0.12em] text-stone">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Nume</th>
                <th scope="col" className="px-5 py-3 font-medium">Email</th>
                <th scope="col" className="px-5 py-3 font-medium">Cursuri</th>
                <th scope="col" className="px-5 py-3 font-medium">Înregistrat</th>
                <th scope="col" className="px-5 py-3"><span className="sr-only">Acțiuni</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-sand/40">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/elevi/${u.id}`} className="font-medium text-ink hover:text-bronze">
                      {[u.surname, u.name].filter(Boolean).join(' ')}
                    </Link>
                    {u.role === 'admin' && (
                      <span className="ml-2 bg-ink px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-champagne-light">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-stone">{u.email}</td>
                  <td className="px-5 py-3.5 text-ink">{u._count.enrollments}</td>
                  <td className="px-5 py-3.5 text-stone">{dateFormat.format(u.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/elevi/${u.id}`} className="text-[13px] text-bronze underline-offset-4 hover:underline">
                      Gestionează
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
