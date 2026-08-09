import {
  numberOrNull,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

import {
  buildCaptureData
} from "./character-recipe-operation-capture-reader.mjs";

import {
  buildOperationComparison
} from "./character-recipe-operation-comparison.mjs";

import {
  summarizeUnavailableRecipes
} from "./character-recipe-operation-unavailable.mjs";

export function buildCharacterRecipeOperationReport(
  root
) {
  const captureData =
    buildCaptureData(root);

  const comparison =
    buildOperationComparison(
      captureData.recipeRows
    );

  return {
    addonVersion:
      stringOrNull(
        root.addonVersion
      ),
    schemaVersion:
      numberOrNull(
        root.schemaVersion
      ),
    totals:
      captureData.totals,
    captures:
      captureData.captures,
    metricKeyCount:
      comparison.metricKeys.length,
    metricKeys:
      comparison.metricKeys,
    comparedRecipeCount:
      comparison.comparedRecipeCount,
    metricComparisons:
      comparison.metricComparisons,
    differingRecipeComparisons:
      comparison.differingRecipes,
    exactUnavailableRecipes:
      summarizeUnavailableRecipes(
        captureData.exactUnavailableRows
      )
  };
}