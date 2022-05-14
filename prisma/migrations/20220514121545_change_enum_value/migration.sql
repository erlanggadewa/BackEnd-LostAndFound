/*
  Warnings:

  - The `statusAnswer` column on the `Answer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `statusQuestion` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusQuestion" AS ENUM ('Waiting', 'Answered', 'Rejected', 'Finished');

-- CreateEnum
CREATE TYPE "StatusAnswer" AS ENUM ('Waiting', 'Accepted', 'Rejected', 'Finished');

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "statusAnswer",
ADD COLUMN     "statusAnswer" "StatusAnswer" NOT NULL DEFAULT E'Waiting';

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "statusQuestion",
ADD COLUMN     "statusQuestion" "StatusQuestion" NOT NULL DEFAULT E'Waiting';

-- DropEnum
DROP TYPE "StatusConfirmation";
