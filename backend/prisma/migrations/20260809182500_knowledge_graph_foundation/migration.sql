-- CreateEnum
CREATE TYPE "KnowledgeNodeType" AS ENUM ('CONCEPT', 'PERSON', 'ORGANISATION', 'TECHNOLOGY', 'TOPIC', 'CONTRIBUTION', 'CATEGORY', 'TAG');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('RELATED_TO', 'SUPPORTS', 'CONTRADICTS', 'DEPENDS_ON', 'EXTENDS', 'DERIVED_FROM', 'BELONGS_TO');

-- CreateTable
CREATE TABLE "KnowledgeNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "KnowledgeNodeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "contributionId" TEXT,

    CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeRelationship" (
    "id" TEXT NOT NULL,
    "type" "RelationshipType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,
    "contributionId" TEXT,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,

    CONSTRAINT "KnowledgeRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeNode_type_idx" ON "KnowledgeNode"("type");

-- CreateIndex
CREATE INDEX "KnowledgeNode_name_idx" ON "KnowledgeNode"("name");

-- CreateIndex
CREATE INDEX "KnowledgeNode_userId_idx" ON "KnowledgeNode"("userId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_sourceNodeId_idx" ON "KnowledgeRelationship"("sourceNodeId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_targetNodeId_idx" ON "KnowledgeRelationship"("targetNodeId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_type_idx" ON "KnowledgeRelationship"("type");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeRelationship_sourceNodeId_targetNodeId_type_key" ON "KnowledgeRelationship"("sourceNodeId", "targetNodeId", "type");

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "KnowledgeContribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "KnowledgeContribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
