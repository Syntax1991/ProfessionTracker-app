-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "realm" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'eu',
    "className" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 80,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Profession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CharacterProfession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "skill" INTEGER NOT NULL DEFAULT 0,
    "knowledgePoints" INTEGER NOT NULL DEFAULT 0,
    "specializationSummary" TEXT,
    CONSTRAINT "CharacterProfession_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterProfession_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_realm_region_key" ON "Character"("name", "realm", "region");

-- CreateIndex
CREATE UNIQUE INDEX "Profession_key_key" ON "Profession"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterProfession_characterId_professionId_key" ON "CharacterProfession"("characterId", "professionId");
