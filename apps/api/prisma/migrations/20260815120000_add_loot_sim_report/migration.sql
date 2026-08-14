-- CreateTable
CREATE TABLE "LootSimReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "reportUrl" TEXT NOT NULL,
    "publicTitle" TEXT NOT NULL,
    "charClass" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "baselineDps" REAL NOT NULL,
    "upgradesJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LootSimReport_memberId_key" ON "LootSimReport"("memberId");
