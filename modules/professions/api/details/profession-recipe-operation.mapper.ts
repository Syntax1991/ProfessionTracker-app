import type {
  ProfessionRecipeOperation,
  ProfessionRecipeOperationCoverage
} from "./profession-recipe.types.js";

type OperationRecord = {
  baseSkill: number | null;
  bonusSkill: number | null;
  effectiveSkill: number | null;
  craftingQuality: number | null;
  craftingQualityId: number | null;
  guaranteedCraftingQualityId: number | null;
  lowerSkillThreshold: number | null;
  upperSkillThreshold: number | null;
  concentrationCost: number | null;
  concentrationCurrencyId: number | null;
  ingenuityRefund: number | null;
  quality: number | null;
  operationMetricsJson: string | null;
  operationCapturedAt: Date | null;
  operationCaptureVersion: number | null;
  operationScopeVersion: number | null;
};

export function calculateOperationCoveragePercent(
  total: number,
  captured: number
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round(
    (
      captured /
      total
    ) *
    1000
  ) / 10;
}

export function mapProfessionRecipeOperation(
  record: OperationRecord
): ProfessionRecipeOperation {
  const captured =
    record.operationMetricsJson !==
      null &&
    (
      record.operationCaptureVersion ??
      0
    ) >= 3 &&
    (
      record.operationScopeVersion ??
      0
    ) >= 1;

  return {
    status:
      captured
        ? "CAPTURED"
        : "MISSING",

    baseSkill:
      record.baseSkill,

    bonusSkill:
      record.bonusSkill,

    effectiveSkill:
      record.effectiveSkill,

    craftingQuality:
      record.craftingQuality,

    craftingQualityId:
      record.craftingQualityId,

    guaranteedCraftingQualityId:
      record.guaranteedCraftingQualityId,

    lowerSkillThreshold:
      record.lowerSkillThreshold,

    upperSkillThreshold:
      record.upperSkillThreshold,

    concentrationCost:
      record.concentrationCost,

    concentrationCurrencyId:
      record.concentrationCurrencyId,

    ingenuityRefund:
      record.ingenuityRefund,

    quality:
      record.quality,

    capturedAt:
      record.operationCapturedAt
        ?.toISOString() ??
      null,

    captureVersion:
      record.operationCaptureVersion,

    scopeVersion:
      record.operationScopeVersion
  };
}

export function createProfessionRecipeOperationCoverage(
  operations:
    ProfessionRecipeOperation[]
): ProfessionRecipeOperationCoverage {
  const capturedCrafterCount =
    operations.filter(
      (operation) =>
        operation.status ===
        "CAPTURED"
    ).length;

  const totalCrafterCount =
    operations.length;

  return {
    totalCrafterCount,

    capturedCrafterCount,

    missingCrafterCount:
      totalCrafterCount -
      capturedCrafterCount,

    coveragePercent:
      calculateOperationCoveragePercent(
        totalCrafterCount,
        capturedCrafterCount
      )
  };
}