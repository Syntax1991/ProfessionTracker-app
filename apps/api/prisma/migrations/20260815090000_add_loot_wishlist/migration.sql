-- CreateTable
CREATE TABLE "LootTierPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "tierSlot" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "LootTierPreference_memberId_idx" ON "LootTierPreference"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "LootTierPreference_memberId_tierSlot_key" ON "LootTierPreference"("memberId", "tierSlot");

-- CreateTable
CREATE TABLE "LootTrinketChoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "LootTrinketChoice_memberId_idx" ON "LootTrinketChoice"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "LootTrinketChoice_memberId_rank_key" ON "LootTrinketChoice"("memberId", "rank");
