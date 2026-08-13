import type {
  ProfessionRecipeCraftStatus,
  ProfessionRecipeOperation
} from "./profession-recipe.types.js";

function isNonQualityOperation(
  operation:
    ProfessionRecipeOperation
): boolean {
  return (
    operation.craftingQualityId ===
      0 &&
    operation.lowerSkillThreshold ===
      0 &&
    operation.upperSkillThreshold ===
      0
  );
}

export function calculateProfessionRecipeCraftStatus(
  baseDifficulty: number | null,
  operation:
    ProfessionRecipeOperation
): ProfessionRecipeCraftStatus {
  if (
    operation.status !==
    "CAPTURED"
  ) {
    return "UNKNOWN";
  }

  if (
    isNonQualityOperation(
      operation
    )
  ) {
    return "SAFE";
  }

  if (
    baseDifficulty === null ||
    baseDifficulty <= 0 ||
    operation.effectiveSkill ===
      null ||
    operation.upperSkillThreshold ===
      null ||
    operation.concentrationCost ===
      null
  ) {
    return "UNKNOWN";
  }

  if (
    operation.effectiveSkill >=
    baseDifficulty
  ) {
    return "SAFE";
  }

  /*
   * Concentration can bridge one quality step. It is sufficient for the
   * final step only when the current upper threshold reaches the recipe's
   * final difficulty threshold.
   */
  if (
    operation.concentrationCost > 0 &&
    operation.upperSkillThreshold >=
      baseDifficulty
  ) {
    return "CONCENTRATION";
  }

  return "NOT_SAFE";
}

export function getProfessionRecipeCraftStatusPriority(
  status:
    ProfessionRecipeCraftStatus
): number {
  switch (status) {
    case "SAFE":
      return 0;

    case "CONCENTRATION":
      return 1;

    case "NOT_SAFE":
      return 2;

    case "UNKNOWN":
      return 3;
  }
}

export function getBestProfessionRecipeCraftStatus(
  statuses:
    ProfessionRecipeCraftStatus[]
): ProfessionRecipeCraftStatus {
  if (
    statuses.length === 0
  ) {
    return "UNKNOWN";
  }

  return statuses.reduce(
    (
      best,
      current
    ) =>
      getProfessionRecipeCraftStatusPriority(
        current
      ) <
      getProfessionRecipeCraftStatusPriority(
        best
      )
        ? current
        : best
  );
}