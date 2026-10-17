import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// În dezvoltare păstrăm o singură instanță între reîncărcări (HMR). O refolosim doar dacă
// vine din același client generat: după `prisma generate` (schemă nouă) se creează alta,
// fără să fie nevoie de repornirea serverului.
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  prismaClass: typeof PrismaClient | undefined;
};

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma && globalForPrisma.prismaClass === PrismaClient
    ? globalForPrisma.prisma
    : createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaClass = PrismaClient;
}
