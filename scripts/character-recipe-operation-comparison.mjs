import {
  buildMetricStats
} from "./character-recipe-operation-metric-stats.mjs";

import {
  buildRecipeComparisons
} from "./character-recipe-operation-recipe-comparison.mjs";

export function buildOperationComparison(recipeRows) {
  const metricKeys =
    buildMetricStats(recipeRows);

  const recipeComparison =
    buildRecipeComparisons(recipeRows);

  return {
    metricKeys,
    comparedRecipeCount:
      recipeComparison.comparedRecipeCount,
    metricComparisons:
      recipeComparison.metricComparisons,
    differingRecipes:
      recipeComparison.differingRecipes
  };
}