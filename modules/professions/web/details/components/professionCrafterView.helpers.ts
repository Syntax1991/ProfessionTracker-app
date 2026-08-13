import type {
  ProfessionCharacterCoverage
} from "../types/professionDetail.types";
import type {
  ProfessionRecipeCatalogItem,
  ProfessionRecipeCraftStatus
} from "../types/professionRecipe.types";
import {
  getProfessionRecipeGroupName
} from "../utils/professionRecipePresentation";
import type {
  ProfessionCrafterRecipeEntry
} from "./ProfessionCrafterRecipeTable";

export type ProfessionCrafterSummary = {
  coverage:
    ProfessionCharacterCoverage;
  entries:
    ProfessionCrafterRecipeEntry[];
  safeCount: number;
};

export function createCrafterEntries(
  recipes:
    ProfessionRecipeCatalogItem[],
  characterId: string
): ProfessionCrafterRecipeEntry[] {
  const entries:
    ProfessionCrafterRecipeEntry[] =
    [];

  for (const recipe of recipes) {
    const crafter =
      recipe.crafters.find(
        (candidate) =>
          candidate.characterId ===
          characterId
      );

    if (!crafter) {
      continue;
    }

    entries.push({
      recipe,
      crafter,
      group:
        getProfessionRecipeGroupName(
          recipe
        )
    });
  }

  return entries.sort(
    (left, right) =>
      left.group.localeCompare(
        right.group,
        "en"
      ) ||
      left.recipe.name.localeCompare(
        right.recipe.name,
        "en"
      )
  );
}

export function countCrafterStatus(
  entries:
    ProfessionCrafterRecipeEntry[],
  status:
    ProfessionRecipeCraftStatus
): number {
  return entries.filter(
    (entry) =>
      entry.crafter.craftStatus ===
      status
  ).length;
}

export function createCrafterSummaries(
  characters:
    ProfessionCharacterCoverage[],
  recipes:
    ProfessionRecipeCatalogItem[]
): ProfessionCrafterSummary[] {
  return characters.map(
    (coverage) => {
      const entries =
        createCrafterEntries(
          recipes,
          coverage.character.id
        );

      return {
        coverage,
        entries,
        safeCount:
          countCrafterStatus(
            entries,
            "SAFE"
          )
      };
    }
  );
}

export function getCrafterGroups(
  entries:
    ProfessionCrafterRecipeEntry[]
): string[] {
  return Array.from(
    new Set(
      entries.map(
        (entry) =>
          entry.group
      )
    )
  ).sort(
    (left, right) =>
      left.localeCompare(
        right,
        "en"
      )
  );
}

export function matchesCrafterRecipeQuery(
  entry:
    ProfessionCrafterRecipeEntry,
  query: string
): boolean {
  const normalized =
    query
      .trim()
      .toLocaleLowerCase(
        "en"
      );

  if (!normalized) {
    return true;
  }

  return [
    entry.recipe.name,
    entry.group
  ].some(
    (value) =>
      value
        .toLocaleLowerCase(
          "en"
        )
        .includes(
          normalized
        )
  );
}