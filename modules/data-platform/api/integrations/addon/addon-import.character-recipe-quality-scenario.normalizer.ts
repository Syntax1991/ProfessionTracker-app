import {
  asNumber,
  asString,
  asTable,
  numericValues
} from "./addon-import.lua-utils.js";
import type {
  AddonCharacterRecipeQualityScenario,
  AddonCharacterRecipeReagentSelection,
  AddonRecipeOperationMetrics,
  AddonRecipeReagentSchema,
  LuaValue
} from "./addon-import.types.js";

type OperationNormalizer = (
  value: LuaValue | undefined
) => AddonRecipeOperationMetrics;

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

function optionalNonNegativeNumber(
  value: LuaValue | undefined
): number | null {
  const number =
    asNumber(
      value
    );

  return (
    number !== null &&
    number >= 0
  )
    ? number
    : null;
}

function findCatalogSlot(
  reagentSchema:
    AddonRecipeReagentSchema | null,
  slotIndex: number
) {
  return (
    reagentSchema?.reagentSlots.find(
      (slot) =>
        slot.slotIndex ===
        slotIndex
    ) ??
    null
  );
}

function normalizeSelection(
  value: LuaValue,
  reagentSchema:
    AddonRecipeReagentSchema | null
): AddonCharacterRecipeReagentSelection | null {
  const selection =
    asTable(
      value
    );

  if (!selection) {
    return null;
  }

  const slotIndex =
    nonNegativeNumber(
      selection.slotIndex
    );

  const candidateIndex =
    nonNegativeNumber(
      selection.candidateIndex
    );

  const catalogSlot =
    findCatalogSlot(
      reagentSchema,
      slotIndex
    );

  const catalogCandidate =
    catalogSlot?.reagents.find(
      (candidate) =>
        candidate.candidateIndex ===
        candidateIndex
    ) ??
    null;

  return {
    slotIndex,

    dataSlotIndex:
      optionalNonNegativeNumber(
        selection.dataSlotIndex
      ) ??
      catalogSlot?.dataSlotIndex ??
      0,

    candidateIndex,

    itemId:
      asNumber(
        selection.itemID
      ) ??
      catalogCandidate?.itemId ??
      null,

    currencyId:
      asNumber(
        selection.currencyID
      ) ??
      catalogCandidate?.currencyId ??
      null,

    quality:
      asNumber(
        selection.quality
      ) ??
      catalogCandidate?.quality ??
      null,

    quantity:
      optionalNonNegativeNumber(
        selection.quantity
      ) ??
      catalogSlot?.quantityRequired ??
      0
  };
}

function normalizeSelections(
  value: LuaValue | undefined,
  reagentSchema:
    AddonRecipeReagentSchema | null
): AddonCharacterRecipeReagentSelection[] {
  return numericValues(
    asTable(
      value
    )
  )
    .map(
      (selection) =>
        normalizeSelection(
          selection,
          reagentSchema
        )
    )
    .filter(
      (
        selection
      ): selection is
        AddonCharacterRecipeReagentSelection =>
        selection !== null
    );
}

function calculateQualityScore(
  selections:
    AddonCharacterRecipeReagentSelection[]
): number {
  return selections.reduce(
    (
      total,
      selection
    ) =>
      total +
      (
        selection.quality !== null
          ? selection.quality *
            selection.quantity
          : 0
      ),
    0
  );
}

function createQualitySignature(
  selections:
    AddonCharacterRecipeReagentSelection[]
): string {
  return selections
    .map(
      (selection) =>
        [
          selection.dataSlotIndex,
          selection.quality ?? "x",
          selection.candidateIndex
        ].join(":")
    )
    .join("|");
}

function normalizeScenario(
  value: LuaValue,
  fallbackIndex: number,
  reagentSchema:
    AddonRecipeReagentSchema | null,
  normalizeOperation:
    OperationNormalizer
): AddonCharacterRecipeQualityScenario | null {
  const scenario =
    asTable(
      value
    );

  if (!scenario) {
    return null;
  }

  const selections =
    normalizeSelections(
      scenario.selections,
      reagentSchema
    );

  const storedScenarioIndex =
    optionalNonNegativeNumber(
      scenario.scenarioIndex
    );

  const scenarioIndex =
    storedScenarioIndex !== null &&
    storedScenarioIndex > 0
      ? storedScenarioIndex
      : fallbackIndex;

  return {
    scenarioIndex,

    qualityScore:
      optionalNonNegativeNumber(
        scenario.qualityScore
      ) ??
      calculateQualityScore(
        selections
      ),

    qualitySignature:
      asString(
        scenario.qualitySignature
      ) ??
      createQualitySignature(
        selections
      ),

    selections,

    operationMetrics:
      normalizeOperation(
        scenario.operationMetrics
      )
  };
}

export function normalizeCharacterRecipeQualityScenarios(
  value: LuaValue | undefined,
  reagentSchema:
    AddonRecipeReagentSchema | null,
  normalizeOperation:
    OperationNormalizer
): AddonCharacterRecipeQualityScenario[] {
  return numericValues(
    asTable(
      value
    )
  )
    .map(
      (
        scenario,
        index
      ) =>
        normalizeScenario(
          scenario,
          index + 1,
          reagentSchema,
          normalizeOperation
        )
    )
    .filter(
      (
        scenario
      ): scenario is
        AddonCharacterRecipeQualityScenario =>
        scenario !== null
    )
    .sort(
      (
        left,
        right
      ) =>
        left.scenarioIndex -
        right.scenarioIndex
    );
}