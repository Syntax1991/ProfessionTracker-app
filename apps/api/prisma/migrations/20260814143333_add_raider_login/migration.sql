-- AlterTable
ALTER TABLE "GuildMember" ADD COLUMN "linkedRaiderAccountId" TEXT;

-- CreateTable
CREATE TABLE "RaiderAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "battleTag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RaiderSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raiderAccountId" TEXT NOT NULL,
    "charactersJson" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RaiderSession_raiderAccountId_fkey" FOREIGN KEY ("raiderAccountId") REFERENCES "RaiderAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildMember_linkedRaiderAccountId_key" ON "GuildMember"("linkedRaiderAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "RaiderAccount_battleTag_key" ON "RaiderAccount"("battleTag");

-- CreateIndex
CREATE INDEX "RaiderSession_raiderAccountId_idx" ON "RaiderSession"("raiderAccountId");
