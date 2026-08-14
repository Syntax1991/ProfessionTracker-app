-- AlterTable
ALTER TABLE "RaidBoss" ADD COLUMN "fightDurationSeconds" INTEGER;

-- AlterTable
ALTER TABLE "RaidCooldownAssignment" ADD COLUMN "timestampSeconds" INTEGER;

-- CreateTable
CREATE TABLE "RaidBossPhaseMarker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bossId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startSeconds" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidBossPhaseMarker_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "RaidBoss" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RaidBossPhaseMarker_bossId_idx" ON "RaidBossPhaseMarker"("bossId");
