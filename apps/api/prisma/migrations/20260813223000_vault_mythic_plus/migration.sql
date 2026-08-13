-- CreateTable
CREATE TABLE "WeeklyMythicPlusRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "dungeonName" TEXT,
    "keyLevel" INTEGER NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyMythicPlusRun_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WeeklyMythicPlusRun_characterId_periodKey_idx" ON "WeeklyMythicPlusRun"("characterId", "periodKey");

-- CreateIndex
CREATE INDEX "WeeklyMythicPlusRun_periodKey_keyLevel_idx" ON "WeeklyMythicPlusRun"("periodKey", "keyLevel");
