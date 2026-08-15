-- CreateTable
CREATE TABLE "RaidWeek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RaidPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raidWeekId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Main Progress',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidPlan_raidWeekId_fkey" FOREIGN KEY ("raidWeekId") REFERENCES "RaidWeek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaidSetup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raidPlanId" TEXT NOT NULL,
    "raidEventId" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Main Setup',
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "wclReportCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidSetup_raidPlanId_fkey" FOREIGN KEY ("raidPlanId") REFERENCES "RaidPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RaidSetup_raidEventId_fkey" FOREIGN KEY ("raidEventId") REFERENCES "RaidEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaidCooldownSetupMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "setupId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RaidCooldownSetupMember_setupId_fkey" FOREIGN KEY ("setupId") REFERENCES "RaidSetup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RaidWeek_startsAt_key" ON "RaidWeek"("startsAt");

-- CreateIndex
CREATE INDEX "RaidPlan_raidWeekId_idx" ON "RaidPlan"("raidWeekId");

-- CreateIndex
CREATE UNIQUE INDEX "RaidSetup_raidEventId_key" ON "RaidSetup"("raidEventId");

-- CreateIndex
CREATE INDEX "RaidSetup_raidPlanId_idx" ON "RaidSetup"("raidPlanId");

-- CreateIndex
CREATE INDEX "RaidCooldownSetupMember_memberId_idx" ON "RaidCooldownSetupMember"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "RaidCooldownSetupMember_setupId_memberId_key" ON "RaidCooldownSetupMember"("setupId", "memberId");
