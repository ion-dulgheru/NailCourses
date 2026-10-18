// Date de pornire pentru dezvoltare: cursurile de pe Acasă, cu lecții.
// Textele sunt PROVIZORII — se înlocuiesc cu cele trimise de clientă (din admin, când există).
// Rulare: pnpm prisma db seed  (idempotent: actualizează după slug, nu dublează)
import "dotenv/config";
import { prisma } from "../src/lib/db";
import type { CourseLevel } from "../src/generated/prisma/client";
import { lessonContent } from "./seed-content";

type SeedLesson = { slug: string; title: string; minutes: number; free?: boolean };

type SeedCourse = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  level: CourseLevel;
  priceMdl: number;
  coverImage: string;
  coverAlt: string;
  whatYouLearn: string[];
  forWho: string[];
  materials: string[];
  lessons: SeedLesson[];
};

const courses: SeedCourse[] = [
  {
    slug: "bazele-manichiurii",
    title: "Bazele Manichiurii",
    category: "Curs fundamente",
    shortDescription:
      "Învață bazele unei manichiuri profesionale și construiește o tehnică sigură, de la pregătire până la aplicare.",
    longDescription:
      "Un curs pentru cine pornește de la zero: înveți să pregătești unghia corect, să lucrezi igienic și să aplici oja semipermanentă curat, fără scurgeri și fără desprinderi. Fiecare lecție arată pas cu pas, de aproape, exact ce face mâna instructoarei.",
    level: "incepator",
    priceMdl: 1200,
    coverImage: "/images/nail-natural.png",
    coverAlt: "Manichiură nude naturală, unghii scurte ovale",
    whatYouLearn: [
      "Dezinfectarea și organizarea locului de muncă",
      "Pregătirea unghiei și îndepărtarea cuticulei",
      "Pilirea formelor de bază: oval, migdală, pătrat",
      "Aplicarea bazei, culorii și top-ului fără scurgeri",
      "Cum previi desprinderea și ciupirea unghiei",
      "Îndepărtarea corectă a ojei semipermanente",
    ],
    forWho: [
      "Începătoare care vor să lucreze din pasiune sau ca meserie",
      "Cine își face singură manichiura și vrea rezultat de salon",
      "Viitoare manichiuriste care vor o bază solidă",
    ],
    materials: [
      "Lampă UV/LED de minimum 48 W",
      "Pile 180/240 și buffer",
      "Bază, top și 2–3 culori de ojă semipermanentă",
      "Împingător de cuticule și cleștișor",
      "Dezinfectant pentru mâini și instrumente",
    ],
    lessons: [
      { slug: "introducere", title: "Introducere și organizarea locului de muncă", minutes: 8, free: true },
      { slug: "igiena-si-dezinfectarea", title: "Igiena și dezinfectarea instrumentelor", minutes: 12 },
      { slug: "pregatirea-unghiei", title: "Pregătirea unghiei și cuticula", minutes: 18 },
      { slug: "forme-de-baza", title: "Pilirea formelor de bază", minutes: 15 },
      { slug: "aplicarea-ojei", title: "Aplicarea bazei, culorii și top-ului", minutes: 22 },
      { slug: "greseli-frecvente", title: "Greșeli frecvente și cum le eviți", minutes: 10 },
      { slug: "indepartarea", title: "Îndepărtarea corectă a ojei", minutes: 9 },
    ],
  },
  {
    slug: "perfectionarea-tehnicii",
    title: "Gel Perfection",
    category: "Curs gel",
    shortDescription:
      "Rafinează arhitectura unghiei, lucrul la cuticule și finisajul, pentru rezultate curate și rezistente.",
    longDescription:
      "Pentru manichiuristele care lucrează deja și vor rezultate de nivel premium: arhitectură corectă, apex bine plasat, nivelare cu gel și un finisaj care ține 3–4 săptămâni.",
    level: "intermediar",
    priceMdl: 1800,
    coverImage: "/images/nail-palepink.png",
    coverAlt: "Manichiură roz pal cu finisaj lucios, formă rotunjită",
    whatYouLearn: [
      "Arhitectura unghiei și plasarea apexului",
      "Nivelarea cu gel pe unghia naturală",
      "Lucrul curat în zona cuticulei",
      "Corectarea unghiilor problematice",
      "Finisaj lucios și rezistent în timp",
    ],
    forWho: [
      "Manichiuriste active care vor să-și ridice nivelul",
      "Absolvente ale cursului de bază",
    ],
    materials: [
      "Lampă UV/LED",
      "Gel de construcție și bază rubber",
      "Pensule pentru gel",
      "Pile 100/180 și 180/240",
    ],
    lessons: [
      { slug: "arhitectura-unghiei", title: "Arhitectura unghiei", minutes: 16, free: true },
      { slug: "nivelarea-cu-gel", title: "Nivelarea cu gel", minutes: 24 },
      { slug: "zona-cuticulei", title: "Lucrul în zona cuticulei", minutes: 18 },
      { slug: "unghii-problematice", title: "Unghii problematice", minutes: 20 },
      { slug: "finisajul", title: "Finisajul final", minutes: 14 },
    ],
  },
  {
    slug: "nail-art-masterclass",
    title: "Nail Art Masterclass",
    category: "Curs avansat",
    shortDescription:
      "Foiță aurie, linii fine, french modern și compoziții elegante — designurile pe care clientele le cer.",
    longDescription:
      "Un masterclass de design: tehnicile care fac diferența în portofoliu și care se vând cel mai bine în salon, explicate pas cu pas.",
    level: "avansat",
    priceMdl: 2400,
    coverImage: "/images/nail-darkpink.png",
    coverAlt: "Nail art în nuanță zmeurie cu foiță aurie și linii fine",
    whatYouLearn: [
      "French modern și micro-french",
      "Linii fine cu pensula liner",
      "Foiță aurie și efecte metalice",
      "Compoziții elegante pe set complet",
    ],
    forWho: ["Manichiuriste cu experiență care vor să ofere design"],
    materials: ["Pensulă liner", "Gel-paint negru și alb", "Foiță aurie", "Top fără strat lipicios"],
    lessons: [
      { slug: "french-modern", title: "French modern", minutes: 20, free: true },
      { slug: "linii-fine", title: "Linii fine", minutes: 18 },
      { slug: "folia-aurie", title: "Foiță aurie și efecte metalice", minutes: 16 },
      { slug: "compozitii", title: "Compoziții pe set complet", minutes: 26 },
    ],
  },
];

// Datele de pe site (subsol, contact, certificat). Se creează doar dacă lipsesc — nu suprascriu setările din admin.
const settings: Record<string, string> = {
  firma_denumire: "GJ Nail Studio SRL",
  firma_idno: "", // se completează din admin cu IDNO-ul real
  firma_adresa: "or. Ialoveni, str. Alexandru cel Bun 12, Republica Moldova",
  firma_telefon: "+373 60 206 061",
  contact_email: "contact@gjnailstudio.md",
  instagram_url: "https://www.instagram.com/gjnailstudio",
  facebook_url: "",
  tiktok_url: "",
  certificat_semnatura: "Fondatoarea GJ Nail Studio",
  certificat_text: "a absolvit cu succes cursul",
};

async function main() {
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, create: { key, value }, update: {} });
  }
  console.log(`✓ Setări: ${Object.keys(settings).length} chei`);

  for (const [index, { lessons, ...course }] of courses.entries()) {
    const data = { ...course, status: "publicat" as const, position: index };
    const saved = await prisma.course.upsert({
      where: { slug: course.slug },
      create: data,
      update: data,
    });

    for (const [position, lesson] of lessons.entries()) {
      const content = lessonContent[`${course.slug}/${lesson.slug}`];
      const lessonData = {
        title: lesson.title,
        description: content?.description ?? "",
        position,
        durationSeconds: lesson.minutes * 60,
        isFreePreview: lesson.free ?? false,
      };
      const savedLesson = await prisma.lesson.upsert({
        where: { courseId_slug: { courseId: saved.id, slug: lesson.slug } },
        create: { ...lessonData, courseId: saved.id, slug: lesson.slug },
        update: lessonData,
      });

      // Blocurile se creează doar pentru lecțiile goale, ca să nu ștergem ce a compus adminul.
      const hasBlocks = await prisma.lessonBlock.count({ where: { lessonId: savedLesson.id } });
      if (!content || hasBlocks) continue;
      const blocks = [
        { type: "video" as const, text: "", videoKey: `cursuri/${course.slug}/${lesson.slug}.mp4` },
        ...content.sections.flatMap((section) => [
          { type: "titlu" as const, text: section.heading, videoKey: null },
          ...section.paragraphs.map((text) => ({ type: "text" as const, text, videoKey: null })),
        ]),
      ];
      await prisma.lessonBlock.createMany({
        data: blocks.map((block, i) => ({ ...block, lessonId: savedLesson.id, position: i })),
      });
    }
    console.log(`✓ ${course.title}: ${lessons.length} lecții`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
