import { ButtonLink, SectionTitle, container } from './primitives'

export function FinalCta() {
  return (
    <section className="bg-ink py-16 lg:py-24">
      <div className={`${container} flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between`}>
        <SectionTitle tone="light" className="max-w-[40rem]">
          Du-ți abilitățile la următorul <em>nivel</em>
        </SectionTitle>
        <ButtonLink href="#cursuri" className="self-start lg:self-auto">
          Descoperă cursurile
        </ButtonLink>
      </div>
    </section>
  )
}
