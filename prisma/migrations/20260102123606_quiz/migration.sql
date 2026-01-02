/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Question` table. All the data in the column will be lost.
  - Added the required column `answer` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "correctAnswer",
DROP COLUMN "question",
ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
