-- CreateTable
CREATE TABLE "GuildVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildName" TEXT NOT NULL,
    "realmName" TEXT NOT NULL,
    "realmSlug" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "faction" TEXT,
    "memberCount" INTEGER,
    "verifiedCharacter" TEXT NOT NULL,
    "verifiedRealmSlug" TEXT NOT NULL,
    "verifiedRank" INTEGER NOT NULL,
    "leadershipThreshold" INTEGER NOT NULL DEFAULT 2,
    "verifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
