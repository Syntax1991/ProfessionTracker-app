import {
  asNumber,
  asString,
  asTable
} from "./addon-import.lua-utils.js";
import {
  normalizeOperationMetrics
} from "./addon-import.operation-metrics.normalizer.js";
import {
  normalizeCharacterRecipeQualityScenarios
} from "./addon-import.character-recipe-quality-scenario.normalizer.js";
import type {
  AddonCharacterRecipeReagentSimulation,
  LuaValue
} from "./addon-import.types.js";

function nonNegativeNumber(
  value: LuaValue | undefined
): number {
  const number =
    asNumber(
      value
    );

  return (
    number !== null &&
    number >= 0
  )
    ? number
    : 0;
}

export function normalizeCharacterRecipeReagentSimulation(
  value: LuaValue | undefined
): AddonCharacterRecipeReagentSimulation | null {
  const simulation =
    asTable(
      value
    );

  if (!simulation) {
    return null;
  }

  return {
    captureVersion:
      nonNegativeNumber(
        simulation.captureVersion
      ),

    status:
      asString(
        simulation.status
      ),

    requiredModifiedSlotCount:
      nonNegativeNumber(
        simulation.requiredModifiedSlotCount
      ),

    simulatedSlotCount:
      nonNegativeNumber(
        simulation.simulatedSlotCount
      ),

    qualitySlotCount:
      nonNegativeNumber(
        simulation.qualitySlotCount
      ),

    concentrationCaptured:
      simulation.concentrationCaptured ===
      true,

    lowestQualityOperation:
      normalizeOperationMetrics(
        simulation.lowestQualityOperation
      ),

    highestQualityOperation:
      normalizeOperationMetrics(
        simulation.highestQualityOperation
      ),

    highestQualityConcentrationOperation:
      normalizeOperationMetrics(
        simulation.highestQualityConcentrationOperation
      ),

    qualityScenarioStatus:
      asString(
        simulation.qualityScenarioStatus
      ),

    qualityScenarioLimit:
      nonNegativeNumber(
        simulation.qualityScenarioLimit
      ),

    qualityScenarioCombinationCount:
      nonNegativeNumber(
        simulation.qualityScenarioCombinationCount
      ),

    qualityScenarioCapturedCount:
      nonNegativeNumber(
        simulation.qualityScenarioCapturedCount
      ),

    qualityScenarios:
      normalizeCharacterRecipeQualityScenarios(
        simulation.qualityScenarios
      )
  };
}