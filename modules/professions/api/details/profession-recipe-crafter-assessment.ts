import type {
  ProfessionRecipeCrafterRecommendation,
  ProfessionRecipeCraftStatus,
  ProfessionRecipeQualityScenario,
  ProfessionRecipeReagentSelection,
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
    number | null = null,
  selections:
    ProfessionRecipeReagentSelection[] = []
): ProfessionRecipeCrafterRecommendation {
  return {
    kind,
    craftStatus:
      result.craftStatus,
    effectiveSkill:
      result.operation.effectiveSkill,
    craftingQuality:
      result.operation.craftingQuality,
    concentrationCost,
    selections
  };
}

function createUnknownRecommendation():
  ProfessionRecipeCrafterRecommendation {
  return {
    kind: "UNKNOWN",
    craftStatus: "UNKNOWN",
    effectiveSkill: null,
    craftingQuality: null,
    concentrationCost: null,
    selections: []
  };
}

function compareQualityScenarios(
  left: ProfessionRecipeQualityScenario,
  right: ProfessionRecipeQualityScenario
): number {
  return (
    left.qualityScore -
      right.qualityScore ||
    (
      left.qualitySignature ??
      ""
    ).localeCompare(
      right.qualitySignature ??
      ""
    ) ||
    left.scenarioIndex -
      right.scenarioIndex
  );
}

function getCapturedQualityScenarios(
  simulation:
    ProfessionRecipeReagentSimulation
): ProfessionRecipeQualityScenario[] {
  if (
    simulation.qualityScenarioStatus !==
      "CAPTURED" &&
    simulation.qualityScenarioStatus !==
      "PARTIAL"
  ) {
    return [];
  }

  return simulation.qualityScenarios
    .filter(
      (scenario) =>
        isCaptured(
          scenario.result
        )
    )
    .sort(
      compareQualityScenarios
    );
}

function getMinimumSafeQualityScenario(
  simulation:
    ProfessionRecipeReagentSimulation
): ProfessionRecipeQualityScenario | null {
  return (
    getCapturedQualityScenarios(
      simulation
    ).find(
      (scenario) =>
        scenario.result.craftStatus ===
        "SAFE"
    ) ??
    null
  );
}

function getMaximumQualityScore(
  simulation:
    ProfessionRecipeReagentSimulation
): number | null {
  const scenarios =
    getCapturedQualityScenarios(
      simulation
    );

  const [
    firstScenario,
    ...remainingScenarios
  ] = scenarios;

  if (!firstScenario) {
    return null;
  }

  return remainingScenarios.reduce(
    (maximum, scenario) =>
      Math.max(
        maximum,
        scenario.qualityScore
      ),
    firstScenario.qualityScore
  );
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

  const minimumScenario =
    getMinimumSafeQualityScenario(
      simulation
    );

  const maximumQualityScore =
    getMaximumQualityScore(
      simulation
    );

  if (
    minimumScenario &&
    maximumQualityScore !== null &&
    minimumScenario.qualityScore <
      maximumQualityScore
  ) {
    return createRecommendation(
      "MINIMUM_MATS",
      minimumScenario.result,
      null,
      minimumScenario.selections
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

  if (minimumScenario) {
    return createRecommendation(
      "MINIMUM_MATS",
      minimumScenario.result,
      null,
      minimumScenario.selections
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
      concentrationCost: null,
      selections: []
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
    case "MINIMUM_MATS":
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