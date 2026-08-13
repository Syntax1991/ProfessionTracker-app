import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionRecipeCoverage
} from "./profession-detail.types.js";

type DetailRecord =
  NonNullable<
    Awaited<
      ReturnType<
        ProfessionDetailRepository["findById"]
      >
    >
  >;

type DetailAssignment =
  DetailRecord["assignments"][number];

type DetailRecipe =
  DetailAssignment["recipes"][number];

export function mapProfessionRecipeCoverage(
  assignment: DetailAssignment
): ProfessionRecipeCoverage[] {
  return assignment.recipes
    .map(
      mapRecipeCoverage
    )
    .sort(
      compareRecipeCoverage
    );
}

function mapRecipeCoverage(
  entry: DetailRecipe
): ProfessionRecipeCoverage {
  return {
    id:
      entry.recipe.id,

    gameRecipeId:
      entry.recipe.gameRecipeId,

    name:
      entry.recipe.name,

    skillLineId:
      entry.recipe.skillLineId,

    expansion:
      entry.recipe.expansion,

    categoryId:
      entry.recipe.categoryId,

    source:
      entry.source,

    lastSyncedAt:
      entry.lastSyncedAt
        ?.toISOString() ??
      null
  };
}

function compareRecipeCoverage(
  left:
    ProfessionRecipeCoverage,
  right:
    ProfessionRecipeCoverage
): number {
  return (
    left.expansion.localeCompare(
      right.expansion,
      "de"
    ) ||
    left.name.localeCompare(
      right.name,
      "de"
    ) ||
    left.gameRecipeId -
      right.gameRecipeId
  );
}