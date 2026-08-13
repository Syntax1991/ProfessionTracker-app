-- CreateTable
CREATE TABLE "GuildTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GuildTeamMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuildTeamMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "GuildTeam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GuildTeamMembership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GuildMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildTeam_name_key" ON "GuildTeam"("name");

-- CreateIndex
CREATE INDEX "GuildTeamMembership_memberId_idx" ON "GuildTeamMembership"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildTeamMembership_teamId_memberId_key" ON "GuildTeamMembership"("teamId", "memberId");
