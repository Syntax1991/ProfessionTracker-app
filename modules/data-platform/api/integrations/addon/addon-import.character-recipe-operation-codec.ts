import {
  assignCompactScalar,
  decodeCompactGenericMap,
  decodeCompactMetricMap
} from "./addon-import.character-recipe-metric-codec.js";
import type {
  LuaTable,
  LuaValue
} from "./addon-import.types.js";

const STORAGE_FORMAT = "C1";
const SIMULATION_FORMAT =
  "BASE_DELTA_CATALOG_REF_V1";

function asLegacyTable(
  value: LuaValue
): LuaTable | null {
  return (
    typeof value === "object" &&
    value !== null
  )
    ? value as LuaTable
    : null;
}

function decodeSelection(
  value: string
): LuaTable | null {
  if (value[0] === "r") {
    const parts =
      value.slice(1).split(".");

    const slotIndex =
      Number(parts[0]);

    const candidateIndex =
      Number(parts[1]);

    if (
      Number.isFinite(slotIndex) &&
      Number.isFinite(candidateIndex)
    ) {
      return {
        slotIndex,
        candidateIndex
      };
    }

    return null;
  }

  if (value[0] === "m") {
    return decodeCompactGenericMap(
      value.slice(1)
    );
  }

  return null;
}

function decodeSelections(
  value: string
): LuaTable {
  const result: LuaTable = {};

  if (
    !value ||
    value === "-"
  ) {
    return result;
  }

  let index = 1;

  for (
    const selectionValue of
    value.split("/")
  ) {
    const selection =
      decodeSelection(
        selectionValue
      );

    if (selection) {
      result[
        String(index)
      ] = selection;

      index += 1;
    }
  }

  return result;
}

function decodeScenario(
  value: string
): LuaTable | null {
  const fields =
    value.split("~");

  if (fields.length < 5) {
    return null;
  }

  const scenario: LuaTable = {
    selections:
      decodeSelections(
        fields[1] ?? "-"
      ),

    operationMetrics:
      decodeCompactMetricMap(
        fields[2]
      )
  };

  assignCompactScalar(
    scenario,
    "qualityScore",
    fields[0]
  );

  assignCompactScalar(
    scenario,
    "scenarioIndex",
    fields[3]
  );

  assignCompactScalar(
    scenario,
    "qualitySignature",
    fields[4]
  );

  return scenario;
}

function decodeScenarios(
  value: string
): LuaTable {
  const result: LuaTable = {};

  if (
    !value ||
    value === "-"
  ) {
    return result;
  }

  let index = 1;

  for (
    const scenarioValue of
    value.split("!")
  ) {
    const scenario =
      decodeScenario(
        scenarioValue
      );

    if (scenario) {
      result[
        String(index)
      ] = scenario;

      index += 1;
    }
  }

  return result;
}

function decodeSimulation(
  metaValue: string,
  lowValue: string,
  highValue: string,
  concentrationValue: string,
  scenarioValue: string
): LuaTable | undefined {
  const meta =
    metaValue.split(",");

  if (meta[0] !== "1") {
    return undefined;
  }

  const simulation: LuaTable = {
    storageFormat:
      SIMULATION_FORMAT,

    lowestQualityOperation:
      decodeCompactMetricMap(
        lowValue
      ),

    highestQualityOperation:
      decodeCompactMetricMap(
        highValue
      ),

    highestQualityConcentrationOperation:
      decodeCompactMetricMap(
        concentrationValue
      ),

    qualityScenarios:
      decodeScenarios(
        scenarioValue
      )
  };

  const keys = [
    "captureVersion",
    "status",
    "requiredModifiedSlotCount",
    "simulatedSlotCount",
    "qualitySlotCount",
    "concentrationCaptured",
    "qualityScenarioStatus",
    "qualityScenarioLimit",
    "qualityScenarioCombinationCount",
    "qualityScenarioCapturedCount"
  ];

  keys.forEach(
    (
      key,
      index
    ) =>
      assignCompactScalar(
        simulation,
        key,
        meta[index + 1]
      )
  );

  return simulation;
}

export function decodeCharacterRecipeOperationValue(
  value: LuaValue,
  fallbackRecipeId: number
): LuaTable | null {
  const legacy =
    asLegacyTable(value);

  if (legacy) {
    return legacy;
  }

  if (
    typeof value !== "string" ||
    !value.startsWith(
      `${STORAGE_FORMAT}|`
    )
  ) {
    return null;
  }

  const parts =
    value.split("|");

  const storedRecipeId =
    Number(parts[1]);

  const recipeId =
    Number.isFinite(storedRecipeId)
      ? storedRecipeId
      : fallbackRecipeId;

  if (!Number.isFinite(recipeId)) {
    return null;
  }

  const recipe: LuaTable = {
    recipeId,

    operationMetrics:
      decodeCompactMetricMap(
        parts[2]
      )
  };

  const simulation =
    decodeSimulation(
      parts[3] ?? "0",
      parts[4] ?? "-",
      parts[5] ?? "-",
      parts[6] ?? "-",
      parts[7] ?? "-"
    );

  if (simulation) {
    recipe.reagentSimulation =
      simulation;
  }

  return recipe;
}