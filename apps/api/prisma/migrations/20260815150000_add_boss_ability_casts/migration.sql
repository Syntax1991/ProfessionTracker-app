-- CreateTable
CREATE TABLE "RaidBossAbilityCast" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bossId" TEXT NOT NULL,
    "abilityName" TEXT NOT NULL,
    "timestampSeconds" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidBossAbilityCast_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "RaidBoss" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RaidBossAbilityCast_bossId_idx" ON "RaidBossAbilityCast"("bossId");
