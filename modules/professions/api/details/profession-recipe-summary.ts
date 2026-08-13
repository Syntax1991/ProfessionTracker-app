import {
  calculateOperationCoveragePercent
} from "./profession-recipe-operation.mapper.js";
import type {
  ProfessionRecipeCatalogItem,
  ProfessionRecipeCatalogSummary
} from "./profession-recipe.types.js";

export function createProfessionRecipeCatalogSummary(
  items:
    ProfessionRecipeCatalogItem[]
): ProfessionRecipeCatalogSummary {
  const craftableRecipeCount =
    items.filter(
      (recipe) =>
        recipe.crafters.length >
        0
    ).length;

  const crafterRecipeCount =
    items.reduce(
      (
        total,
        recipe
      ) =>
        total +
        recipe.operationCoverage
          .totalCrafterCount,
      0
    );

  const operationCapturedCrafterRecipeCount =
    items.reduce(
      (
        total,
        recipe
      ) =>
        total +
        recipe.operationCoverage
          .capturedCrafterCount,
      0
    );

  return {
    catalogRecipeCount:
      items.length,

    craftableRecipeCount,

    missingRecipeCount:
      items.length -
      craftableRecipeCount,

    crafterRecipeCount,

    operationCapturedCrafterRecipeCount,

    operationMissingCrafterRecipeCount:
      crafterRecipeCount -
      operationCapturedCrafterRecipeCount,

    operationCoveragePercent:
      calculateOperationCoveragePercent(
        crafterRecipeCount,
        operationCapturedCrafterRecipeCount
      )
  };
}