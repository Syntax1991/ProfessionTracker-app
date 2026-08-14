-- CreateTable
CREATE TABLE "RaidCooldownAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bossId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "abilityName" TEXT NOT NULL,
    "phaseLabel" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidCooldownAssignment_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "RaidBoss" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RaidCooldownAssignment_bossId_idx" ON "RaidCooldownAssignment"("bossId");

-- CreateIndex
CREATE INDEX "RaidCooldownAssignment_memberId_idx" ON "RaidCooldownAssignment"("memberId");
