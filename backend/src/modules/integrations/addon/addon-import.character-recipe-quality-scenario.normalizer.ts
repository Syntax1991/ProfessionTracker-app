import {
  asNumber,
  asString,
  asTable,
  numericValues
} from "./addon-import.lua-utils.js";
import {
  normalizeOperationMetrics
} from "./addon-import.operation-metrics.normalizer.js";
import type {
  AddonCharacterRecipeQualityScenario,
  AddonCharacterRecipeReagentSelection,
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

function normalizeSelection(
  value: LuaValue
): AddonCharacterRecipeReagentSelection | null {
  const selection =
    asTable(
      value
    );

  if (!selection) {
    return null;
  }

  return {
    slotIndex:
      nonNegativeNumber(
        selection.slotIndex
      ),

    dataSlotIndex:
      nonNegativeNumber(
        selection.dataSlotIndex
      ),

    candidateIndex:
      nonNegativeNumber(
        selection.candidateIndex
      ),

    itemId:
      asNumber(
        selection.itemID
      ),

    currencyId:
      asNumber(
        selection.currencyID
      ),

    quality:
      asNumber(
        selection.quality
      ),

    quantity:
      nonNegativeNumber(
        selection.quantity
      )
  };
}

function normalizeSelections(
  value: LuaValue | undefined
): AddonCharacterRecipeReagentSelection[] {
  return numericValues(
    asTable(
      value
    )
  )
    .map(
      normalizeSelection
    )
    .filter(
      (
        selection
      ): selection is
        AddonCharacterRecipeReagentSelection =>
        selection !== null
    );
}

function normalizeScenario(
  value: LuaValue
): AddonCharacterRecipeQualityScenario | null {
  const scenario =
    asTable(
      value
    );

  if (!scenario) {
    return null;
  }

  const scenarioIndex =
    nonNegativeNumber(
      scenario.scenarioIndex
    );

  if (scenarioIndex <= 0) {
    return null;
  }

  return {
    scenarioIndex,

    qualityScore:
      nonNegativeNumber(
        scenario.qualityScore
      ),

    qualitySignature:
      asString(
        scenario.qualitySignature
      ),

    selections:
      normalizeSelections(
        scenario.selections
      ),

    operationMetrics:
      normalizeOperationMetrics(
        scenario.operationMetrics
      )
  };
}

export function normalizeCharacterRecipeQualityScenarios(
  value: LuaValue | undefined
): AddonCharacterRecipeQualityScenario[] {
  return numericValues(
    asTable(
      value
    )
  )
    .map(
      normalizeScenario
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