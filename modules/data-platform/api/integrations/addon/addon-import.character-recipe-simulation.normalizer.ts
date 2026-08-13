import {
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
  AddonRecipeOperationMetrics,
  AddonRecipeReagentSchema,
  LuaValue
} from "./addon-import.types.js";

const COMPACT_STORAGE_FORMAT =
  "BASE_DELTA_CATALOG_REF_V1";

function nonNegativeNumber(
  value: LuaValue | undefined
): number {
  const tableValue =
    typeof value === "number"
      ? value
      : null;

  return (
    tableValue !== null &&
    tableValue >= 0
  )
    ? tableValue
    : 0;
}

function normalizeStoredOperation(
  value: LuaValue | undefined,
  baseOperationMetrics:
    AddonRecipeOperationMetrics,
  useBaseDelta: boolean
): AddonRecipeOperationMetrics {
  const table =
    asTable(
      value
    );

  if (!table) {
    return {};
  }

  const storedMetrics =
    normalizeOperationMetrics(
      value
    );

  if (!useBaseDelta) {
    return storedMetrics;
  }

  return {
    ...baseOperationMetrics,
    ...storedMetrics
  };
}

export function normalizeCharacterRecipeReagentSimulation(
  value: LuaValue | undefined,
  baseOperationMetrics:
    AddonRecipeOperationMetrics,
  reagentSchema:
    AddonRecipeReagentSchema | null
): AddonCharacterRecipeReagentSimulation | null {
  const simulation =
    asTable(
      value
    );

  if (!simulation) {
    return null;
  }

  const useBaseDelta =
    asString(
      simulation.storageFormat
    ) ===
    COMPACT_STORAGE_FORMAT;

  const normalizeSimulationOperation =
    (
      operation:
        LuaValue | undefined
    ) =>
      normalizeStoredOperation(
        operation,
        baseOperationMetrics,
        useBaseDelta
      );

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
      normalizeSimulationOperation(
        simulation.lowestQualityOperation
      ),

    highestQualityOperation:
      normalizeSimulationOperation(
        simulation.highestQualityOperation
      ),

    highestQualityConcentrationOperation:
      normalizeSimulationOperation(
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
        simulation.qualityScenarios,
        reagentSchema,
        normalizeSimulationOperation
      )
  };
}