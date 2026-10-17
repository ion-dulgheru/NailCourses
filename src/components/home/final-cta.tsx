import { ButtonLink, SectionTitle, container } from './primitives'

export function FinalCta() {
  return (
    <section className="bg-ink py-16 text-center lg:py-24">
      <div className={container}>
        <SectionTitle tone="light" className="mx-auto max-w-2xl">
          Du-ți abilitățile la următorul nivel
        </SectionTitle>
        <ButtonLink href="#cursuri" className="mt-8">
          Descoperă cursurile
        </ButtonLink>
      </div>
    </section>
  )
}
