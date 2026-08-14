-- CreateTable
CREATE TABLE "RaidBoss" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raidEventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidBoss_raidEventId_fkey" FOREIGN KEY ("raidEventId") REFERENCES "RaidEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaidBossRosterEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bossId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidBossRosterEntry_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "RaidBoss" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RaidBoss_raidEventId_idx" ON "RaidBoss"("raidEventId");

-- CreateIndex
CREATE INDEX "RaidBossRosterEntry_memberId_idx" ON "RaidBossRosterEntry"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "RaidBossRosterEntry_bossId_memberId_key" ON "RaidBossRosterEntry"("bossId", "memberId");
