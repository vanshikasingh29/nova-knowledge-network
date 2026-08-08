/*
  Warnings:

  - Added the required column `updatedAt` to the `ExpertProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `KnowledgeContribution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "ExpertProfile" DROP CONSTRAINT "ExpertProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "KnowledgeContribution" DROP CONSTRAINT "KnowledgeContribution_authorId_fkey";

-- AlterTable
ALTER TABLE "ExpertProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "organisation" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "KnowledgeContribution" ADD COLUMN     "status" "ContributionStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "ExpertProfile" ADD CONSTRAINT "ExpertProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeContribution" ADD CONSTRAINT "KnowledgeContribution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
