-- CreateTable
CREATE TABLE "WeeklyChecklistTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "WeeklyChecklistCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyChecklistCompletion_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeeklyChecklistCompletion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "WeeklyChecklistTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyChecklistTask_key_key" ON "WeeklyChecklistTask"("key");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyChecklistCompletion_characterId_taskId_periodKey_key" ON "WeeklyChecklistCompletion"("characterId", "taskId", "periodKey");

-- CreateIndex
CREATE INDEX "WeeklyChecklistCompletion_periodKey_idx" ON "WeeklyChecklistCompletion"("periodKey");

-- CreateIndex
CREATE INDEX "WeeklyChecklistCompletion_taskId_periodKey_idx" ON "WeeklyChecklistCompletion"("taskId", "periodKey");
