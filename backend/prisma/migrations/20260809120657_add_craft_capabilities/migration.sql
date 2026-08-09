-- CreateTable
CREATE TABLE "CraftCapability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professionId" TEXT NOT NULL,
    "expansion" TEXT NOT NULL DEFAULT 'MIDNIGHT',
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slotKey" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CraftCapability_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CraftRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professionId" TEXT NOT NULL,
    "gameRecipeId" INTEGER NOT NULL,
    "skillLineId" INTEGER,
    "expansion" TEXT NOT NULL DEFAULT 'MIDNIGHT',
    "name" TEXT NOT NULL,
    "categoryId" INTEGER,
    "craftedItemId" INTEGER,
    "baseDifficulty" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'ADDON',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CraftRecipe_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CraftRecipeCapability" (
    "craftRecipeId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("craftRecipeId", "capabilityId"),
    CONSTRAINT "CraftRecipeCapability_craftRecipeId_fkey" FOREIGN KEY ("craftRecipeId") REFERENCES "CraftRecipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CraftRecipeCapability_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "CraftCapability" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterCraftRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterProfessionId" TEXT NOT NULL,
    "craftRecipeId" TEXT NOT NULL,
    "learned" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'ADDON',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterCraftRecipe_characterProfessionId_fkey" FOREIGN KEY ("characterProfessionId") REFERENCES "CharacterProfession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterCraftRecipe_craftRecipeId_fkey" FOREIGN KEY ("craftRecipeId") REFERENCES "CraftRecipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CraftCapability_professionId_expansion_idx" ON "CraftCapability"("professionId", "expansion");

-- CreateIndex
CREATE INDEX "CraftCapability_professionId_expansion_type_idx" ON "CraftCapability"("professionId", "expansion", "type");

-- CreateIndex
CREATE UNIQUE INDEX "CraftCapability_professionId_expansion_key_key" ON "CraftCapability"("professionId", "expansion", "key");

-- CreateIndex
CREATE INDEX "CraftRecipe_professionId_expansion_idx" ON "CraftRecipe"("professionId", "expansion");

-- CreateIndex
CREATE INDEX "CraftRecipe_gameRecipeId_idx" ON "CraftRecipe"("gameRecipeId");

-- CreateIndex
CREATE INDEX "CraftRecipe_craftedItemId_idx" ON "CraftRecipe"("craftedItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CraftRecipe_professionId_gameRecipeId_key" ON "CraftRecipe"("professionId", "gameRecipeId");

-- CreateIndex
CREATE INDEX "CraftRecipeCapability_capabilityId_idx" ON "CraftRecipeCapability"("capabilityId");

-- CreateIndex
CREATE INDEX "CharacterCraftRecipe_craftRecipeId_idx" ON "CharacterCraftRecipe"("craftRecipeId");

-- CreateIndex
CREATE INDEX "CharacterCraftRecipe_source_idx" ON "CharacterCraftRecipe"("source");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterCraftRecipe_characterProfessionId_craftRecipeId_key" ON "CharacterCraftRecipe"("characterProfessionId", "craftRecipeId");
