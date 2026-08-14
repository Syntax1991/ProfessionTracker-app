-- CreateTable
CREATE TABLE "RaidSignup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raidEventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TENTATIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidSignup_raidEventId_fkey" FOREIGN KEY ("raidEventId") REFERENCES "RaidEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RaidSignup_memberId_idx" ON "RaidSignup"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "RaidSignup_raidEventId_memberId_key" ON "RaidSignup"("raidEventId", "memberId");
