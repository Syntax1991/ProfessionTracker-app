-- CreateTable
CREATE TABLE "ProfessionSpecializationTree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professionId" TEXT NOT NULL,
    "expansion" TEXT NOT NULL DEFAULT 'MIDNIGHT',
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProfessionSpecializationTree_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfessionSpecializationNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "treeId" TEXT NOT NULL,
    "parentNodeId" TEXT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxRank" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProfessionSpecializationNode_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "ProfessionSpecializationTree" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProfessionSpecializationNode_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "ProfessionSpecializationNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterProfessionNodeProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterProfessionId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterProfessionNodeProgress_characterProfessionId_fkey" FOREIGN KEY ("characterProfessionId") REFERENCES "CharacterProfession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterProfessionNodeProgress_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ProfessionSpecializationNode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProfessionSpecializationTree_professionId_expansion_idx" ON "ProfessionSpecializationTree"("professionId", "expansion");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionSpecializationTree_professionId_expansion_key_key" ON "ProfessionSpecializationTree"("professionId", "expansion", "key");

-- CreateIndex
CREATE INDEX "ProfessionSpecializationNode_treeId_parentNodeId_idx" ON "ProfessionSpecializationNode"("treeId", "parentNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionSpecializationNode_treeId_key_key" ON "ProfessionSpecializationNode"("treeId", "key");

-- CreateIndex
CREATE INDEX "CharacterProfessionNodeProgress_nodeId_idx" ON "CharacterProfessionNodeProgress"("nodeId");

-- CreateIndex
CREATE INDEX "CharacterProfessionNodeProgress_source_idx" ON "CharacterProfessionNodeProgress"("source");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterProfessionNodeProgress_characterProfessionId_nodeId_key" ON "CharacterProfessionNodeProgress"("characterProfessionId", "nodeId");

-- CreateIndex
CREATE INDEX "CharacterProfession_professionId_idx" ON "CharacterProfession"("professionId");
