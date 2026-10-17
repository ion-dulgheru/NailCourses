-- Lecțiile se compun din blocuri (titlu, text, video); video-ul nu mai stă pe lecție.

-- CreateEnum
CREATE TYPE "LessonBlockType" AS ENUM ('titlu', 'text', 'video');

-- CreateTable
CREATE TABLE "LessonBlock" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lessonId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "LessonBlockType" NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "videoKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonBlock_pkey" PRIMARY KEY ("id")
);

-- Videoclipurile legate deja de lecții devin primul bloc al lecției.
INSERT INTO "LessonBlock" ("lessonId", "position", "type", "videoKey", "updatedAt")
SELECT "id", 0, 'video', "bunnyVideoId", CURRENT_TIMESTAMP FROM "Lesson" WHERE "bunnyVideoId" IS NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "bunnyVideoId";

-- CreateIndex
CREATE INDEX "LessonBlock_lessonId_position_idx" ON "LessonBlock"("lessonId", "position");

-- AddForeignKey
ALTER TABLE "LessonBlock" ADD CONSTRAINT "LessonBlock_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
