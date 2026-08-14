-- CreateTable
CREATE TABLE "GuildMemberGearSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    "itemName" TEXT,
    "itemLevel" INTEGER,
    "quality" TEXT,
    "enchantStatus" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
    "socketCount" INTEGER NOT NULL DEFAULT 0,
    "filledSocketCount" INTEGER NOT NULL DEFAULT 0,
    "upgradeCurrent" INTEGER,
    "upgradeMax" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuildMemberGearSlot_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GuildMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GuildMemberGearSlot_memberId_idx" ON "GuildMemberGearSlot"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMemberGearSlot_memberId_slotKey_key" ON "GuildMemberGearSlot"("memberId", "slotKey");
