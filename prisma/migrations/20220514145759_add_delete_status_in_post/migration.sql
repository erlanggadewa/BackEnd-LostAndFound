/*
  Warnings:
  - Made the column `activeStatus` on table `Post` required. This step will fail if there are existing NULL values in that column.
*/

-- AlterTable

ALTER TABLE
    "Post"
ADD
    COLUMN "deleteStatus" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN
    "activeStatus"
SET
    NOT NULL;