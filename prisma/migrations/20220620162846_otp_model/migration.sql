-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeStatus" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserOtp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOtp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserOtp" ADD CONSTRAINT "UserOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
