-- AlterTable
ALTER TABLE "KnowledgeContribution" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "KnowledgeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeContributionTag" (
    "contributionId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "KnowledgeContributionTag_pkey" PRIMARY KEY ("contributionId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeCategory_name_key" ON "KnowledgeCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeTag_name_key" ON "KnowledgeTag"("name");

-- AddForeignKey
ALTER TABLE "KnowledgeContribution" ADD CONSTRAINT "KnowledgeContribution_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "KnowledgeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeContributionTag" ADD CONSTRAINT "KnowledgeContributionTag_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "KnowledgeContribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeContributionTag" ADD CONSTRAINT "KnowledgeContributionTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "KnowledgeTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
