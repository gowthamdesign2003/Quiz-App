/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - The `options` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `correctAnswer` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer",
DROP COLUMN "text",
ADD COLUMN     "correctAnswer" TEXT NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL,
DROP COLUMN "options",
ADD COLUMN     "options" TEXT[];
