-- CreateTable
CREATE TABLE "GuildMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "realm" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'eu',
    "className" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 80,
    "rank" TEXT NOT NULL,
    "rankIndex" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "officerNote" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "GuildMember_rankIndex_idx" ON "GuildMember"("rankIndex");

-- CreateIndex
CREATE INDEX "GuildMember_source_idx" ON "GuildMember"("source");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMember_name_realm_region_key" ON "GuildMember"("name", "realm", "region");
