-- Autentificarea trece de pe telefon pe email.
-- Conturile vechi fără email nu se mai pot autentifica, deci se șterg
-- (Account/Session se șterg în cascadă).
DELETE FROM "User" WHERE "email" IS NULL;

-- Emailurile se salvează normalizate, ca unicitatea să nu depindă de majuscule.
UPDATE "User" SET "email" = lower(trim("email"));

-- Rolurile din specificație: elev / admin.
UPDATE "User" SET "role" = 'elev' WHERE "role" = 'USER';
UPDATE "User" SET "role" = 'admin' WHERE "role" = 'ADMIN';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'elev';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
