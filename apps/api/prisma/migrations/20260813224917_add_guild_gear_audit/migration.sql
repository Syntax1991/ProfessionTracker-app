-- AlterTable
ALTER TABLE "GuildMember" ADD COLUMN "auditedAt" DATETIME;
ALTER TABLE "GuildMember" ADD COLUMN "averageItemLevel" REAL;
ALTER TABLE "GuildMember" ADD COLUMN "filledSocketCount" INTEGER;
ALTER TABLE "GuildMember" ADD COLUMN "missingEnchantSlots" INTEGER;
ALTER TABLE "GuildMember" ADD COLUMN "totalSocketCount" INTEGER;

-- AlterTable
ALTER TABLE "GuildRequirement" ADD COLUMN "minimumItemLevel" INTEGER;
