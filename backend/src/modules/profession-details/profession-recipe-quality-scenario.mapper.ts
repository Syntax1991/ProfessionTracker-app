import type {
  ProfessionRecipeQualityScenario,
  ProfessionRecipeQualityScenarioStatus,
  ProfessionRecipeReagentSelection,
  ProfessionRecipeSimulationResult
} from "./profession-recipe.types.js";

type JsonRecord =
  Record<string, unknown>;

type MapSimulationResult = (
  value: unknown
) => ProfessionRecipeSimulationResult;

function asRecord(
  value: unknown
): JsonRecord | null {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
    ? value as JsonRecord
    : null;
}

function numberValue(
  record: JsonRecord,
  key: string
): number | null {
  const value =
    record[key];

  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? value
    : null;
}

function integerValue(
  record: JsonRecord,
  key: string
): number | null {
  const value =
    numberValue(
      record,
      key
    );

  return (
    value !== null &&
    Number.isInteger(value)
  )
    ? value
    : null;
}

function nonNegativeNumber(
  record: JsonRecord,
  key: string
): number {
  const value =
    numberValue(
      record,
      key
    );

  return (
    value !== null &&
    value >= 0
  )
    ? value
    : 0;
}

function nonNegativeInteger(
  record: JsonRecord,
  key: string
): number {
  const value =
    integerValue(
      record,
      key
    );

  return (
    value !== null &&
    value >= 0
  )
    ? value
    : 0;
}

function nullableString(
  record: JsonRecord,
  key: string
): string | null {
  const value =
    record[key];

  return typeof value === "string"
    ? value
    : null;
}

function qualityScenarioStatus(
  value: unknown
): ProfessionRecipeQualityScenarioStatus {
  switch (value) {
    case "CAPTURED":
    case "PARTIAL":
    case "NO_QUALITY_SLOTS":
    case "TOO_MANY_COMBINATIONS":
    case "INCOMPLETE_REAGENTS":
    case "OPERATION_UNAVAILABLE":
      return value;

    default:
      return "UNKNOWN";
  }
}

function mapSelection(
  value: unknown
): ProfessionRecipeReagentSelection | null {
  const raw =
    asRecord(
      value
    );

  if (!raw) {
    return null;
  }

  return {
    slotIndex:
      nonNegativeInteger(
        raw,
        "slotIndex"
      ),

    dataSlotIndex:
      nonNegativeInteger(
        raw,
        "dataSlotIndex"
      ),

    candidateIndex:
      nonNegativeInteger(
        raw,
        "candidateIndex"
      ),

    itemId:
      integerValue(
        raw,
        "itemId"
      ),

    currencyId:
      integerValue(
        raw,
        "currencyId"
      ),

    quality:
      numberValue(
        raw,
        "quality"
      ),

    quantity:
      nonNegativeNumber(
        raw,
        "quantity"
      )
  };
}

function mapScenario(
  value: unknown,
  mapResult: MapSimulationResult
): ProfessionRecipeQualityScenario | null {
  const raw =
    asRecord(
      value
    );

  if (!raw) {
    return null;
  }

  const scenarioIndex =
    nonNegativeInteger(
      raw,
      "scenarioIndex"
    );

  if (scenarioIndex <= 0) {
    return null;
  }

  const selections =
    Array.isArray(
      raw.selections
    )
      ? raw.selections
        .map(
          mapSelection
        )
        .filter(
          (
            selection
          ): selection is
            ProfessionRecipeReagentSelection =>
            selection !== null
        )
      : [];

  return {
    scenarioIndex,

    qualityScore:
      nonNegativeNumber(
        raw,
        "qualityScore"
      ),

    qualitySignature:
      nullableString(
        raw,
        "qualitySignature"
      ),

    selections,

    result:
      mapResult(
        raw.operationMetrics
      )
  };
}

export function mapProfessionRecipeQualityScenarioCapture(
  value: unknown,
  mapResult: MapSimulationResult
) {
  const raw =
    asRecord(
      value
    );

  if (!raw) {
    return {
      qualityScenarioStatus:
        "UNKNOWN" as const,
      qualityScenarioLimit: 0,
      qualityScenarioCombinationCount: 0,
      qualityScenarioCapturedCount: 0,
      qualityScenarios: []
    };
  }

  const qualityScenarios =
    Array.isArray(
      raw.qualityScenarios
    )
      ? raw.qualityScenarios
        .map(
          (scenario) =>
            mapScenario(
              scenario,
              mapResult
            )
        )
        .filter(
          (
            scenario
          ): scenario is
            ProfessionRecipeQualityScenario =>
            scenario !== null
        )
        .sort(
          (left, right) =>
            left.scenarioIndex -
            right.scenarioIndex
        )
      : [];

  return {
    qualityScenarioStatus:
      qualityScenarioStatus(
        raw.qualityScenarioStatus
      ),

    qualityScenarioLimit:
      nonNegativeInteger(
        raw,
        "qualityScenarioLimit"
      ),

    qualityScenarioCombinationCount:
      nonNegativeInteger(
        raw,
        "qualityScenarioCombinationCount"
      ),

    qualityScenarioCapturedCount:
      nonNegativeInteger(
        raw,
        "qualityScenarioCapturedCount"
      ),

    qualityScenarios
  };
}