/*
  Warnings:

  - You are about to drop the column `Answer` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `Question` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `StatusQuestion` on the `Question` table. All the data in the column will be lost.
  - Added the required column `answer` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusQuestion` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "Answer",
ADD COLUMN     "answer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "Question",
DROP COLUMN "StatusQuestion",
ADD COLUMN     "question" TEXT NOT NULL,
ADD COLUMN     "statusQuestion" "StatusConfirmation" NOT NULL;
