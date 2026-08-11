import type {
  ProfessionRecipeCrafterRecommendation,
  ProfessionRecipeCraftStatus,
  ProfessionRecipeReagentSimulation,
  ProfessionRecipeSimulationResult
} from "./profession-recipe.types.js";

function isCaptured(
  result: ProfessionRecipeSimulationResult
): boolean {
  return (
    result.operation.status ===
    "CAPTURED"
  );
}

function createRecommendation(
  kind:
    ProfessionRecipeCrafterRecommendation["kind"],
  result: ProfessionRecipeSimulationResult,
  concentrationCost:
    number | null = null
): ProfessionRecipeCrafterRecommendation {
  return {
    kind,
    craftStatus:
      result.craftStatus,
    effectiveSkill:
      result.operation.effectiveSkill,
    craftingQuality:
      result.operation.craftingQuality,
    concentrationCost
  };
}

function createUnknownRecommendation():
  ProfessionRecipeCrafterRecommendation {
  return {
    kind: "UNKNOWN",
    craftStatus: "UNKNOWN",
    effectiveSkill: null,
    craftingQuality: null,
    concentrationCost: null
  };
}

export function createProfessionRecipeCrafterRecommendation(
  simulation:
    ProfessionRecipeReagentSimulation | null
): ProfessionRecipeCrafterRecommendation {
  if (
    !simulation ||
    simulation.status !== "CAPTURED"
  ) {
    return createUnknownRecommendation();
  }

  const low =
    simulation.lowestQuality;

  if (
    isCaptured(low) &&
    low.craftStatus === "SAFE"
  ) {
    return createRecommendation(
      "LOW_MATS",
      low
    );
  }

  const high =
    simulation.highestQuality;

  if (
    isCaptured(high) &&
    high.craftStatus === "SAFE"
  ) {
    return createRecommendation(
      "HIGH_MATS",
      high
    );
  }

  const highWithConcentration =
    simulation
      .highestQualityWithConcentration;

  if (
    simulation.concentrationCaptured &&
    isCaptured(
      highWithConcentration
    ) &&
    highWithConcentration.craftStatus ===
      "SAFE"
  ) {
    return createRecommendation(
      "HIGH_MATS_CONCENTRATION",
      highWithConcentration,
      highWithConcentration.operation
        .concentrationCost ??
        high.operation.concentrationCost
    );
  }

  if (
    isCaptured(high) &&
    high.craftStatus ===
      "CONCENTRATION"
  ) {
    return createRecommendation(
      "HIGH_MATS_CONCENTRATION",
      high,
      high.operation.concentrationCost
    );
  }

  if (isCaptured(high)) {
    return {
      kind: "NOT_REACHABLE",
      craftStatus: "NOT_SAFE",
      effectiveSkill:
        high.operation.effectiveSkill,
      craftingQuality:
        high.operation.craftingQuality,
      concentrationCost: null
    };
  }

  return createUnknownRecommendation();
}

export function calculateProfessionRecipeCrafterCraftStatus(
  defaultStatus:
    ProfessionRecipeCraftStatus,
  simulation:
    ProfessionRecipeReagentSimulation | null
): ProfessionRecipeCraftStatus {
  const recommendation =
    createProfessionRecipeCrafterRecommendation(
      simulation
    );

  switch (recommendation.kind) {
    case "LOW_MATS":
    case "HIGH_MATS":
      return "SAFE";

    case "HIGH_MATS_CONCENTRATION":
      return "CONCENTRATION";

    case "NOT_REACHABLE":
      return "NOT_SAFE";

    case "UNKNOWN":
      return defaultStatus;
  }
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
    craftStatus !== "CONCENTRATION" ||
    simulation?.status !== "CAPTURED"
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  const recommendation =
    createProfessionRecipeCrafterRecommendation(
      simulation
    );

  return (
    recommendation.concentrationCost ??
    simulation.highestQuality
      .operation.concentrationCost ??
    Number.MAX_SAFE_INTEGER
  );
}