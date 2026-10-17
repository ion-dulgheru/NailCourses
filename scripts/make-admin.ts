// Dă rolul de admin unui cont existent. Rolul nu se poate seta din site (cerință de securitate).
// Rulare: pnpm tsx scripts/make-admin.ts email@exemplu.com
import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Folosire: pnpm tsx scripts/make-admin.ts email@exemplu.com");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Nu există niciun cont cu emailul ${email}. Creează-l întâi din /register.`);
    process.exit(1);
  }

  await prisma.user.update({ where: { email }, data: { role: "admin" } });
  console.log(`✓ ${email} este acum admin.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
