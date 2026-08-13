-- CreateTable
CREATE TABLE "GuildOfficerNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "authorCharacter" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuildOfficerNote_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GuildMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GuildAttendanceEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "raidName" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GuildAttendanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PRESENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuildAttendanceRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "GuildAttendanceEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GuildAttendanceRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GuildMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GuildOfficerNote_memberId_idx" ON "GuildOfficerNote"("memberId");

-- CreateIndex
CREATE INDEX "GuildAttendanceEvent_eventDate_idx" ON "GuildAttendanceEvent"("eventDate");

-- CreateIndex
CREATE INDEX "GuildAttendanceRecord_memberId_idx" ON "GuildAttendanceRecord"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildAttendanceRecord_eventId_memberId_key" ON "GuildAttendanceRecord"("eventId", "memberId");
