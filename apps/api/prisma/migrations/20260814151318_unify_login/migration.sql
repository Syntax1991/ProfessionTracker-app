-- AlterTable
ALTER TABLE "RaiderAccount" ADD COLUMN "accessToken" TEXT;
ALTER TABLE "RaiderAccount" ADD COLUMN "tokenType" TEXT;
ALTER TABLE "RaiderAccount" ADD COLUMN "scope" TEXT;
ALTER TABLE "RaiderAccount" ADD COLUMN "tokenExpiresAt" DATETIME;

-- DropTable
DROP TABLE "BattleNetConnection";
