import type {
  ProfessionRecipeCraftStatus,
  ProfessionRecipeReagentSimulation,
  ProfessionRecipeSimulationResult
} from "./profession-recipe.types.js";

function isCaptured(
  result:
    ProfessionRecipeSimulationResult
): boolean {
  return (
    result.operation.status ===
    "CAPTURED"
  );
}

export function calculateProfessionRecipeCrafterCraftStatus(
  defaultStatus:
    ProfessionRecipeCraftStatus,
  simulation:
    ProfessionRecipeReagentSimulation | null
): ProfessionRecipeCraftStatus {
  if (
    !simulation ||
    simulation.status !==
      "CAPTURED"
  ) {
    return defaultStatus;
  }

  const highestQuality =
    simulation.highestQuality;

  if (
    isCaptured(
      highestQuality
    ) &&
    highestQuality.craftStatus ===
      "SAFE"
  ) {
    return "SAFE";
  }

  const withConcentration =
    simulation
      .highestQualityWithConcentration;

  if (
    simulation.concentrationCaptured &&
    isCaptured(
      withConcentration
    ) &&
    withConcentration.craftStatus ===
      "SAFE"
  ) {
    return "CONCENTRATION";
  }

  if (
    isCaptured(
      highestQuality
    ) &&
    highestQuality.craftStatus ===
      "CONCENTRATION"
  ) {
    return "CONCENTRATION";
  }

  if (
    isCaptured(
      highestQuality
    ) &&
    highestQuality.craftStatus ===
      "NOT_SAFE"
  ) {
    return "NOT_SAFE";
  }

  return defaultStatus;
}

export function getProfessionRecipeCrafterAssessmentSkill(
  simulation:
    ProfessionRecipeReagentSimulation | null,
  fallbackSkill: number
): number {
  if (
    simulation?.status ===
    "CAPTURED"
  ) {
    return (
      simulation.highestQuality
        .operation.effectiveSkill ??
      fallbackSkill
    );
  }

  return fallbackSkill;
}

export function getProfessionRecipeCrafterAssessmentConcentrationCost(
  craftStatus:
    ProfessionRecipeCraftStatus,
  simulation:
    ProfessionRecipeReagentSimulation | null
): number {
  if (
    craftStatus !==
      "CONCENTRATION" ||
    simulation?.status !==
      "CAPTURED"
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  return (
    simulation.highestQuality
      .operation.concentrationCost ??
    Number.MAX_SAFE_INTEGER
  );
}