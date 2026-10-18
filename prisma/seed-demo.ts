// Date DEMO pentru dezvoltare: un admin, eleve, comenzi în toate stările, progres și certificate.
// NU se rulează în producție. Necesită cursurile din seed-ul principal (pnpm prisma db seed).
// Rulare: pnpm tsx prisma/seed-demo.ts  (idempotent: șterge și recreează elevele demo)
import "dotenv/config";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "../src/lib/db";

const DEMO_DOMAIN = "@demo.gjnail.md";
const ADMIN_EMAIL = `admin${DEMO_DOMAIN}`;
const PASSWORD = "Parola123!";
const DAY = 24 * 60 * 60 * 1000;

type DemoAccess = {
  course: string;
  source: "plata" | "manual";
  daysAgo: number;
  done: number | "toate"; // câte lecții a terminat, în ordine
};

type DemoStudent = {
  name: string;
  surname: string;
  email: string;
  telefon?: string;
  daysAgo: number; // vechimea contului
  access: DemoAccess[];
  otherOrders?: { course: string; status: "in_asteptare" | "esuata" | "rambursata"; daysAgo: number }[];
};

const students: DemoStudent[] = [
  {
    name: "Ana", surname: "Popescu", email: "ana", telefon: "+37369123401", daysAgo: 58,
    access: [
      { course: "bazele-manichiurii", source: "plata", daysAgo: 57, done: "toate" },
      { course: "perfectionarea-tehnicii", source: "plata", daysAgo: 30, done: 3 },
    ],
  },
  {
    name: "Maria", surname: "Rusu", email: "maria", telefon: "+37369123402", daysAgo: 45,
    access: [{ course: "bazele-manichiurii", source: "plata", daysAgo: 44, done: 4 }],
  },
  {
    name: "Elena", surname: "Ceban", email: "elena", daysAgo: 40,
    access: [
      { course: "bazele-manichiurii", source: "plata", daysAgo: 39, done: "toate" },
      { course: "perfectionarea-tehnicii", source: "plata", daysAgo: 25, done: "toate" },
      { course: "nail-art-masterclass", source: "plata", daysAgo: 6, done: 1 },
    ],
  },
  {
    name: "Cristina", surname: "Lungu", email: "cristina", telefon: "+37369123404", daysAgo: 33,
    access: [{ course: "nail-art-masterclass", source: "manual", daysAgo: 32, done: "toate" }],
  },
  {
    name: "Victoria", surname: "Moraru", email: "victoria", daysAgo: 21,
    access: [{ course: "bazele-manichiurii", source: "plata", daysAgo: 20, done: 0 }],
    otherOrders: [{ course: "perfectionarea-tehnicii", status: "esuata", daysAgo: 12 }],
  },
  {
    name: "Natalia", surname: "Cojocaru", email: "natalia", telefon: "+37369123406", daysAgo: 18,
    access: [{ course: "perfectionarea-tehnicii", source: "plata", daysAgo: 17, done: 2 }],
  },
  {
    name: "Irina", surname: "Țurcan", email: "irina", daysAgo: 14,
    access: [],
    otherOrders: [{ course: "bazele-manichiurii", status: "rambursata", daysAgo: 13 }],
  },
  {
    name: "Daniela", surname: "Bălan", email: "daniela", daysAgo: 9,
    access: [{ course: "bazele-manichiurii", source: "manual", daysAgo: 8, done: 6 }],
  },
  {
    name: "Olga", surname: "Sârbu", email: "olga", daysAgo: 4,
    access: [],
    otherOrders: [
      { course: "nail-art-masterclass", status: "esuata", daysAgo: 4 },
      { course: "nail-art-masterclass", status: "in_asteptare", daysAgo: 3 },
    ],
  },
  {
    name: "Tatiana", surname: "Munteanu", email: "tatiana", daysAgo: 2,
    access: [{ course: "nail-art-masterclass", source: "plata", daysAgo: 1, done: 0 }],
  },
  { name: "Alina", surname: "Grosu", email: "alina", daysAgo: 1, access: [] },
];

const ago = (days: number, hours = 0) => new Date(Date.now() - days * DAY - hours * 60 * 60 * 1000);

let seq = 0;
const transactionId = () => `DEMO-${String(100000 + ++seq)}`;

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const certificateCode = (issuedAt: Date) =>
  `GJ-${issuedAt.getFullYear()}-` +
  Array.from({ length: 6 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join("");

async function main() {
  const courses = await prisma.course.findMany({
    include: { lessons: { orderBy: { position: "asc" }, select: { id: true } } },
  });
  const bySlug = new Map(courses.map((c) => [c.slug, c]));
  if (bySlug.size === 0) throw new Error("Nu există cursuri. Rulează întâi: pnpm prisma db seed");
  const course = (slug: string) => {
    const found = bySlug.get(slug);
    if (!found) throw new Error(`Cursul ${slug} lipsește`);
    return found;
  };

  // Curățăm datele demo anterioare (comenzile au onDelete: Restrict față de utilizator).
  const old = await prisma.user.findMany({ where: { email: { endsWith: DEMO_DOMAIN } }, select: { id: true } });
  const oldIds = old.map((u) => u.id);
  await prisma.enrollment.deleteMany({ where: { userId: { in: oldIds } } });
  await prisma.order.deleteMany({ where: { userId: { in: oldIds } } });
  await prisma.user.deleteMany({ where: { id: { in: oldIds } } });

  const password = hashSync(PASSWORD, 10);

  await prisma.user.create({
    data: {
      name: "Admin", surname: "GJ Nail", email: ADMIN_EMAIL, password, role: "admin",
      emailVerified: ago(60), createdAt: ago(60),
    },
  });

  let orderCount = 0;
  let certificateCount = 0;

  for (const s of students) {
    const user = await prisma.user.create({
      data: {
        name: s.name, surname: s.surname, email: `${s.email}${DEMO_DOMAIN}`, telefon: s.telefon,
        password, emailVerified: ago(s.daysAgo), createdAt: ago(s.daysAgo),
      },
    });

    for (const a of s.access) {
      const c = course(a.course);
      const grantedAt = ago(a.daysAgo);

      let orderId: string | undefined;
      if (a.source === "plata") {
        const order = await prisma.order.create({
          data: {
            userId: user.id, courseId: c.id, amountMdl: c.priceMdl, status: "platita",
            maibTransactionId: transactionId(), createdAt: grantedAt, paidAt: grantedAt,
          },
        });
        orderId = order.id;
        orderCount++;
      }

      await prisma.enrollment.create({
        data: { userId: user.id, courseId: c.id, source: a.source, orderId, grantedAt },
      });

      // O lecție pe zi, pornind de a doua zi după acces, fără să depășim ziua de azi.
      const done = a.done === "toate" ? c.lessons.length : Math.min(a.done, c.lessons.length);
      const completedDates = c.lessons.slice(0, done).map((_, i) => ago(Math.max(a.daysAgo - 1 - i, 0), 2 + i));
      if (done > 0) {
        await prisma.lessonProgress.createMany({
          data: c.lessons.slice(0, done).map((lesson, i) => ({
            userId: user.id, lessonId: lesson.id, completedAt: completedDates[i],
          })),
        });
      }

      if (done === c.lessons.length && done > 0) {
        const issuedAt = completedDates[done - 1];
        await prisma.certificate.create({
          data: { userId: user.id, courseId: c.id, code: certificateCode(issuedAt), issuedAt },
        });
        certificateCount++;
      }
    }

    for (const o of s.otherOrders ?? []) {
      const c = course(o.course);
      const createdAt = ago(o.daysAgo);
      await prisma.order.create({
        data: {
          userId: user.id, courseId: c.id, amountMdl: c.priceMdl, status: o.status, createdAt,
          maibTransactionId: o.status === "in_asteptare" ? null : transactionId(),
          paidAt: o.status === "rambursata" ? createdAt : null,
        },
      });
      orderCount++;
    }
  }

  console.log(`✓ Admin: ${ADMIN_EMAIL}`);
  console.log(`✓ Eleve: ${students.length}`);
  console.log(`✓ Comenzi: ${orderCount}`);
  console.log(`✓ Certificate: ${certificateCount}`);
  console.log(`  Parola pentru toate conturile demo: ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
