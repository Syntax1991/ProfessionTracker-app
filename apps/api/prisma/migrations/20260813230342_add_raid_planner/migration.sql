-- CreateTable
CREATE TABLE "RaidEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "raidInstance" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'HEROIC',
    "scheduledAt" DATETIME NOT NULL,
    "teamId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "RaidEvent_scheduledAt_idx" ON "RaidEvent"("scheduledAt");

-- CreateIndex
CREATE INDEX "RaidEvent_teamId_idx" ON "RaidEvent"("teamId");
