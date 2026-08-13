ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "baseSkill" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "bonusSkill" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "effectiveSkill" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "craftingQuality" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "craftingQualityId" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "guaranteedCraftingQualityId" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "lowerSkillThreshold" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "upperSkillThreshold" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "concentrationCost" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "concentrationCurrencyId" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "ingenuityRefund" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "quality" REAL;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "operationMetricsJson" TEXT;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "operationCapturedAt" DATETIME;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "operationCaptureVersion" INTEGER;

ALTER TABLE "CharacterCraftRecipe"
ADD COLUMN "operationScopeVersion" INTEGER;

CREATE INDEX "CharacterCraftRecipe_operationCaptureVersion_idx"
ON "CharacterCraftRecipe"("operationCaptureVersion");