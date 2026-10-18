import Image from 'next/image'
import { ButtonLink, SectionTitle, container } from './primitives'

export function Instructor() {
  return (
    <section id="despre" className="scroll-mt-4 bg-ivory py-16 lg:py-28">
      <div className={`${container} grid gap-10 sm:grid-cols-2 sm:items-end lg:grid-cols-12 lg:gap-8`}>
        <div className="relative aspect-[4/5] overflow-hidden lg:col-span-5">
          <Image
            src="/images/instructor.png"
            alt="Fondatoarea GJ Nail Studio, în salon, în fața logo-ului studioului"
            fill
            sizes="(min-width: 1200px) 460px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-[52%_50%]"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pb-6">
          <SectionTitle>
            Înveți de la fondatoarea <em>GJ Nail Studio</em>
          </SectionTitle>

          <div className="mt-8 max-w-[34rem] space-y-4 border-t border-champagne/20 pt-8 text-[15px] leading-[1.7] text-stone lg:text-[17px]">
            <p>
              Ani de lucru zilnic în salon, cu cliente reale și standarde ridicate. Tot ce predau a
              fost testat mai întâi în practică.
            </p>
            <p>
              Filozofia mea: îți explic nu doar ce să faci, ci și de ce — ca să lucrezi cu siguranță
              și să capeți încredere în propria tehnică.
            </p>
            <p>
              Lucrez cu tehnici moderne, actualizate constant, și ofer fiecărei cursante îndrumarea
              de care are nevoie pentru a crește.
            </p>
          </div>

          <ButtonLink href="/despre" variant="outline-dark" className="mt-9">
            Cunoaște instructoarea
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
