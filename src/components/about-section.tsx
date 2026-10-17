import Image from 'next/image'

export function AboutSection() {
  return (
    <section id="despre" className="grid gap-6 px-6 py-14 lg:px-10">
      <div className="grid items-center gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-gold/20">
          <Image
            src="/images/nail-jars.png"
            alt="Produse premium de îngrijire a unghiilor pe un raft"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
        <div>
          <h2 className="font-serif text-3xl text-foreground">About the Studio</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            La GJ Nail Studio lucrăm doar cu produse premium de ultimă generație și respectăm cele mai
            înalte standarde de igienă. Fiecare cursant primește atenție individuală și acces la
            materialele profesionale folosite de manichiuriste experimentate din Ialoveni.
          </p>
        </div>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-2">
        <div className="order-2 rounded-xl border border-gold/40 bg-card/60 p-8 md:order-1">
          <h2 className="font-serif text-3xl text-foreground">Absolvente & Certificate</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Peste zeci de cursante au transformat pasiunea pentru frumusețe într-o carieră profitabilă.
            Fiecare studentă beneficiază de practică intensivă pe modele reale, ghidare dedicată și
            primește diploma oficială recunoscută la finalizarea cursului.
          </p>
        </div>

        <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-gold/20 md:order-2">
          <Image
            src="/images/students.png"
            alt="Cursante GJ Nail Studio cu certificatele de absolvire"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </div>
    </section>
  )
}
