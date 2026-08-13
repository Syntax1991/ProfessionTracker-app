import type {
  ProfessionRecipeBaselineStatus
} from "./profession-recipe.types.js";

export type ProfessionRecipeBaselineReadiness = {
  baselineStatus:
    ProfessionRecipeBaselineStatus;

  baselineSkillGap:
    number | null;

  baselineSkillSurplus:
    number | null;
};

export function calculateProfessionRecipeReadiness(
  baseDifficulty: number | null,
  effectiveSkill: number
): ProfessionRecipeBaselineReadiness {
  if (baseDifficulty === null) {
    return {
      baselineStatus:
        "UNKNOWN",

      baselineSkillGap:
        null,

      baselineSkillSurplus:
        null
    };
  }

  const difference =
    effectiveSkill -
    baseDifficulty;

  if (difference >= 0) {
    return {
      baselineStatus:
        "BASE_SKILL_SUFFICIENT",

      baselineSkillGap:
        0,

      baselineSkillSurplus:
        difference
    };
  }

  return {
    baselineStatus:
      "RECIPE_BONUS_REQUIRED",

    baselineSkillGap:
      Math.abs(
        difference
      ),

    baselineSkillSurplus:
      0
  };
}