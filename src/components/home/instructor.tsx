import Image from 'next/image'
import { ButtonLink, container } from './primitives'

export function Instructor() {
  return (
    <section id="despre" className="scroll-mt-4 bg-ivory pb-16 lg:pb-24">
      <div className={`${container} grid gap-8 sm:grid-cols-2 sm:items-center lg:gap-14`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/images/instructor.png"
            alt="Fondatoarea GJ Nail Studio, în salon, în fața logo-ului studioului"
            fill
            sizes="(min-width: 1200px) 560px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-[52%_50%]"
          />
        </div>

        <div>
          <h2 className="font-display text-[22px] leading-[1.15] uppercase tracking-[0.02em] text-ink sm:text-[24px] md:text-[28px] lg:text-[34px]">
            Despre instructoarea ta:
            <br />
            fondatoarea GJ Nail Studio
          </h2>

          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-stone lg:text-[17px]">
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

          <ButtonLink
            href="/despre"
            className="mt-8 normal-case tracking-normal text-[14px] font-normal"
          >
            Cunoaște instructoarea
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
