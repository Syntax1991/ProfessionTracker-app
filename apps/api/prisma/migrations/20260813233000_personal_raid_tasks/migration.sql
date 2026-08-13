-- CreateTable
CREATE TABLE "PersonalRaidTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'PREPARATION',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "raidName" TEXT,
    "dueAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PersonalRaidTask_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PersonalRaidTask_characterId_completedAt_idx" ON "PersonalRaidTask"("characterId", "completedAt");

-- CreateIndex
CREATE INDEX "PersonalRaidTask_dueAt_idx" ON "PersonalRaidTask"("dueAt");
