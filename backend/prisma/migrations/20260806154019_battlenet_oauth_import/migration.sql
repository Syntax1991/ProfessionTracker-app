-- AlterTable
ALTER TABLE "Character" ADD COLUMN "battleNetId" TEXT;
ALTER TABLE "Character" ADD COLUMN "realmSlug" TEXT;

-- CreateTable
CREATE TABLE "BattleNetConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "battleTag" TEXT,
    "accessToken" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "scope" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BattleNetOAuthState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "BattleNetOAuthState_expiresAt_idx" ON "BattleNetOAuthState"("expiresAt");

-- CreateIndex
CREATE INDEX "Character_battleNetId_region_idx" ON "Character"("battleNetId", "region");

-- CreateIndex
CREATE INDEX "Character_source_idx" ON "Character"("source");
