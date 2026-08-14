-- DropTable
PRAGMA foreign_keys=OFF;
DROP TABLE "GuildAttendanceRecord";
DROP TABLE "GuildAttendanceEvent";
PRAGMA foreign_keys=ON;

-- CreateTable
CREATE TABLE "RaidAttendanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raidEventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PRESENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidAttendanceRecord_raidEventId_fkey" FOREIGN KEY ("raidEventId") REFERENCES "RaidEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RaidAttendanceRecord_memberId_idx" ON "RaidAttendanceRecord"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "RaidAttendanceRecord_raidEventId_memberId_key" ON "RaidAttendanceRecord"("raidEventId", "memberId");
