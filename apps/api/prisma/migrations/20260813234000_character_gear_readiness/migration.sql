-- CreateTable
CREATE TABLE "CharacterGearSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemLevel" INTEGER,
    "enchantStatus" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
    "enchantName" TEXT,
    "socketCount" INTEGER NOT NULL DEFAULT 0,
    "gemCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterGearSlot_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterGearSlot_characterId_slotKey_key" ON "CharacterGearSlot"("characterId", "slotKey");

-- CreateIndex
CREATE INDEX "CharacterGearSlot_slotKey_idx" ON "CharacterGearSlot"("slotKey");

-- CreateIndex
CREATE INDEX "CharacterGearSlot_source_idx" ON "CharacterGearSlot"("source");
