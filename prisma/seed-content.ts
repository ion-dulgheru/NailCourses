// Conținutul PROVIZORIU al lecțiilor (descriere + blocuri). Se înlocuiește din admin cu textele clientei.
// Cheia: `<slug curs>/<slug lecție>`. Video-ul e cheia fișierului din R2; până se urcă, playerul
// afișează „Videoclipul va fi disponibil în curând”.

export type SeedLessonContent = {
  description: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const lessonContent: Record<string, SeedLessonContent> = {
  // ─── Bazele Manichiurii ───────────────────────────────────────────────────
  "bazele-manichiurii/introducere": {
    description: "Ce vei învăța în curs și cum îți organizezi masa de lucru înainte de prima clientă.",
    sections: [
      {
        heading: "Bine ai venit",
        paragraphs: [
          "În acest curs pornim de la zero și ajungem la o manichiură cu ojă semipermanentă curată, rezistentă și sigură pentru unghia naturală. Lecțiile sunt scurte și se urmăresc în ordine: fiecare se sprijină pe cea dinainte.",
          "Îți recomandăm să ai materialele la îndemână și să repeți fiecare pas imediat după ce îl vezi. Mâna învață din exercițiu, nu doar din privit.",
        ],
      },
      {
        heading: "Masa de lucru",
        paragraphs: [
          "Așază instrumentele în ordinea în care le folosești: dezinfectant, pile, împingător, cleștișor, apoi bază, culoare și top. Lampa stă în partea mâinii cu care nu lucrezi, ca să nu o muți la fiecare strat.",
          "Lumina bună e la fel de importantă ca instrumentele: o lampă de masă cu lumină albă rece îți arată scurgerile și zonele neacoperite.",
        ],
      },
    ],
  },
  "bazele-manichiurii/igiena-si-dezinfectarea": {
    description: "Diferența dintre curățare, dezinfectare și sterilizare și protocolul de lucru între cliente.",
    sections: [
      {
        heading: "Trei niveluri de curățenie",
        paragraphs: [
          "Curățarea îndepărtează praful și resturile vizibile. Dezinfectarea distruge majoritatea microorganismelor. Sterilizarea le distruge pe toate, inclusiv sporii — și este obligatorie pentru instrumentele metalice care ating cuticula.",
          "Pilele și bufferele de unică folosință nu se dezinfectează: se aruncă după fiecare clientă sau se dau clientei.",
        ],
      },
      {
        heading: "Protocolul între cliente",
        paragraphs: [
          "Spală instrumentele, scufundă-le în soluție dezinfectantă timpul indicat de producător, clătește, usucă și sterilizează-le în pungi sigilate. Notează data pe pungă.",
          "Masa, lampa și suportul de mână se șterg cu dezinfectant de suprafață înainte de fiecare programare.",
        ],
      },
    ],
  },
  "bazele-manichiurii/pregatirea-unghiei": {
    description: "Împingerea și îndepărtarea cuticulei, matifierea și degresarea plăcii unghiale.",
    sections: [
      {
        heading: "Cuticula",
        paragraphs: [
          "Împinge cuticula cu împingătorul ținut la 45°, fără presiune pe matrice. Pielea moartă de pe placa unghială se ridică cu partea ascuțită și se taie doar ce s-a desprins — nu tăia piele vie.",
          "Dacă apare roșeață sau sângerare, presiunea sau unghiul au fost greșite. Oprește-te și reia mai blând.",
        ],
      },
      {
        heading: "Placa unghială",
        paragraphs: [
          "Matifiază ușor suprafața cu buffer-ul, în aceeași direcție, doar cât să dispară luciul. Apoi degresează cu dehidrator și nu mai atinge unghia cu degetele.",
          "O pregătire bună e jumătate din rezistența manichiurii: majoritatea desprinderilor pornesc de la cuticula rămasă pe placă.",
        ],
      },
    ],
  },
  "bazele-manichiurii/forme-de-baza": {
    description: "Cum pilești oval, migdală și pătrat simetric, cu mișcări care nu despică unghia.",
    sections: [
      {
        heading: "Direcția pilei",
        paragraphs: [
          "Pe unghia naturală pilești dinspre margine spre centru, într-o singură direcție. Mișcarea dus-întors încălzește și despică straturile unghiei.",
          "Verifică simetria privind unghia de sus și din profil, cu degetul clientei întins.",
        ],
      },
      {
        heading: "Cele trei forme",
        paragraphs: [
          "Pătratul are marginea liberă dreaptă și colțurile ușor rotunjite. Ovalul urmează forma cuticulei, inversată. Migdala pornește drept din laterale și se îngustează spre un vârf rotunjit.",
          "Alege forma după lățimea patului unghial și după stilul de viață al clientei: ovalul e cel mai rezistent la lovituri.",
        ],
      },
    ],
  },
  "bazele-manichiurii/aplicarea-ojei": {
    description: "Straturi subțiri, sigilarea marginii libere și polimerizarea corectă în lampă.",
    sections: [
      {
        heading: "Baza",
        paragraphs: [
          "Aplică un strat subțire de bază, frecat ușor în placă, apoi sigilează marginea liberă. Lasă un fir de păr distanță față de cuticulă și laterale.",
          "Polimerizează după timpul indicat de producător. Lampa sub putere sau un strat prea gros lasă gel nepolimerizat dedesubt.",
        ],
      },
      {
        heading: "Culoarea și top-ul",
        paragraphs: [
          "Culoarea se pune în două straturi subțiri, nu într-unul gros. Dacă atingi pielea, curăță cu o pensulă înainte de lampă.",
          "Top-ul se aplică puțin mai generos, se sigilează marginea, se polimerizează, iar stratul lipicios se îndepărtează cu cleaner.",
        ],
      },
    ],
  },
  "bazele-manichiurii/greseli-frecvente": {
    description: "Scurgeri, bule, desprinderi și ciupire în lampă — de unde vin și cum le eviți.",
    sections: [
      {
        heading: "Cele mai des întâlnite",
        paragraphs: [
          "Scurgerile în laterale vin din straturi prea groase sau din mâna clientei ținută înclinată. Bulele apar când agiți sticluța în loc s-o rulezi între palme.",
          "Ciupirea în lampă înseamnă că stratul e gros sau lampa e prea puternică pentru produs: folosește modul cu pornire lentă.",
        ],
      },
      {
        heading: "Desprinderile",
        paragraphs: [
          "Dacă oja se ridică de la cuticulă după câteva zile, cauza e aproape mereu pregătirea: cuticulă rămasă pe placă sau produs pus pe piele. Reia lecția despre pregătire și lucrează mai încet.",
        ],
      },
    ],
  },
  "bazele-manichiurii/indepartarea": {
    description: "Îndepărtarea ojei semipermanente fără să subțiezi unghia naturală.",
    sections: [
      {
        heading: "Pilire și soak-off",
        paragraphs: [
          "Pilește top-ul și o parte din culoare cu o pilă 180, fără să atingi baza. Apoi pune bumbac îmbibat în remover, înfășoară în folie și lasă 10–12 minute.",
          "Oja se împinge ușor cu împingătorul. Ce nu se desprinde singur mai stă câteva minute — nu răzui.",
        ],
      },
      {
        heading: "După îndepărtare",
        paragraphs: [
          "Hidratează cuticula cu ulei și verifică placa: dacă e subțire sau sensibilă, recomandă clientei o pauză sau o bază de întărire.",
        ],
      },
    ],
  },

  // ─── Gel Perfection ───────────────────────────────────────────────────────
  "perfectionarea-tehnicii/arhitectura-unghiei": {
    description: "Zonele unghiei, punctul de stres și unde se plasează apexul ca unghia să nu se rupă.",
    sections: [
      {
        heading: "Zonele unghiei",
        paragraphs: [
          "Împărțim unghia în zona cuticulei, zona de stres (unde unghia se îndoaie) și marginea liberă. Produsul e cel mai subțire la cuticulă și la vârf și cel mai gros în zona de stres.",
          "Apexul este punctul cel mai înalt al construcției și se plasează în treimea din mijloc, puțin spre cuticulă.",
        ],
      },
      {
        heading: "Cum verifici",
        paragraphs: [
          "Privește unghia din profil și dinspre vârf: curba C trebuie să fie uniformă, iar apexul să nu formeze o cocoașă.",
        ],
      },
    ],
  },
  "perfectionarea-tehnicii/nivelarea-cu-gel": {
    description: "Tehnica bilei de gel și lucrul cu gravitația pentru o suprafață perfect netedă.",
    sections: [
      {
        heading: "Bila de gel",
        paragraphs: [
          "Pune o bilă de gel în zona de stres și condu-o spre laterale și cuticulă cu pensula aproape paralelă cu unghia. Nu apăsa: gelul se întinde singur.",
          "Întoarce mâna clientei cu degetul în jos câteva secunde ca gelul să formeze apexul, apoi fixează 10 secunde înainte de polimerizarea completă.",
        ],
      },
      {
        heading: "Pilirea finală",
        paragraphs: [
          "O nivelare bună se pilește puțin. Dacă pilești mult, gelul a fost prea mult sau prea lichid pentru temperatura din cameră.",
        ],
      },
    ],
  },
  "perfectionarea-tehnicii/zona-cuticulei": {
    description: "Cum aplici produsul aproape de cuticulă fără să atingi pielea.",
    sections: [
      {
        heading: "Lucrul la cuticulă",
        paragraphs: [
          "Folosește o pensulă subțire și puțin produs. Împinge gelul spre cuticulă din centru, apoi trage-l spre laterale, lăsând o linie fină de unghie liberă.",
          "Grosimea la cuticulă trebuie să fie aproape zero: o treaptă vizibilă aici se simte la creștere și se desprinde.",
        ],
      },
    ],
  },
  "perfectionarea-tehnicii/unghii-problematice": {
    description: "Unghii moi, curbate în jos, cu pat scurt sau cu margine despicată.",
    sections: [
      {
        heading: "Cazuri frecvente",
        paragraphs: [
          "Unghiile moi au nevoie de o bază rubber mai groasă în zona de stres. Unghiile curbate în jos se corectează treptat, prin construcție, nu dintr-o singură ședință.",
          "Patul scurt se alungește vizual cu o formă ovală și o culoare apropiată de piele.",
        ],
      },
      {
        heading: "Când refuzi lucrarea",
        paragraphs: [
          "Infecții, onicoliză sau unghii desprinse de pat nu se acoperă. Recomandă clientei un medic dermatolog și notează în fișă.",
        ],
      },
    ],
  },
  "perfectionarea-tehnicii/finisajul": {
    description: "Pilirea finală, top-ul și verificarea care fac manichiura să țină 3–4 săptămâni.",
    sections: [
      {
        heading: "Finisajul",
        paragraphs: [
          "Pilește conturul și suprafața cu 180, apoi buffer. Curăță praful cu o pensulă uscată, nu cu cleaner, ca să nu înmoi produsul.",
          "Top-ul se aplică în strat uniform, inclusiv pe marginea liberă. Verifică fiecare unghie din trei unghiuri înainte să o lași pe clientă să plece.",
        ],
      },
    ],
  },

  // ─── Nail Art Masterclass ─────────────────────────────────────────────────
  "nail-art-masterclass/french-modern": {
    description: "French clasic, micro-french și french în V, cu linia zâmbetului simetrică.",
    sections: [
      {
        heading: "Linia zâmbetului",
        paragraphs: [
          "Linia se trasează dintr-o lateral spre centru și apoi din cealaltă lateral, nu dintr-o singură mișcare. Așa obții simetrie pe ambele părți.",
          "Micro-french-ul are 1–2 mm și se potrivește unghiilor scurte; french-ul în V alungește vizual degetul.",
        ],
      },
    ],
  },
  "nail-art-masterclass/linii-fine": {
    description: "Controlul pensulei liner pentru linii drepte, curbe și geometrie.",
    sections: [
      {
        heading: "Pensula liner",
        paragraphs: [
          "Încarcă pensula cu puțin gel-paint și ține-o aproape verticală. Trage linia cu tot antebrațul, nu doar din degete — mâna sprijinită pe masă.",
          "Exersează mai întâi pe tips-uri: zece linii drepte, zece curbe, apoi combinații.",
        ],
      },
    ],
  },
  "nail-art-masterclass/folia-aurie": {
    description: "Foiță aurie, folie de transfer și pigmenți metalici pe top fără strat lipicios.",
    sections: [
      {
        heading: "Foița aurie",
        paragraphs: [
          "Foița se aplică pe un strat de top polimerizat incomplet sau pe un adeziv special. Se presează cu o pensulă uscată și se acoperă cu top.",
          "Pentru un efect elegant, folosește foița pe una-două unghii accent, nu pe tot setul.",
        ],
      },
    ],
  },
  "nail-art-masterclass/compozitii": {
    description: "Cum construiești un set complet coerent: culoare, ritm și unghii accent.",
    sections: [
      {
        heading: "Setul complet",
        paragraphs: [
          "Un set reușit are o idee principală și maximum trei culori. Designul cel mai încărcat se pune pe inelar, iar degetul mare repetă un element mai simplu.",
          "Fotografiază setul în lumină naturală, pe un fundal neutru: aceste poze devin portofoliul tău.",
        ],
      },
    ],
  },
};
