import type {
  ProfessionRecipeCatalogItem
} from "../types/professionRecipe.types";

export type ProfessionRecipeFinderMode =
  | "catalog"
  | "material-quality"
  | "concentration"
  | "recommendations";

type ProfessionRecipeFinderCopy = {
  eyebrow: string;
  title: string;
  description: string;
  metricLabel: string;
  emptyMessage: string;
};

const finderCopy:
  Record<
    ProfessionRecipeFinderMode,
    ProfessionRecipeFinderCopy
  > = {
    catalog: {
      eyebrow: "RECIPES",
      title: "Craft Catalog",
      description:
        "Search every captured recipe and compare the available crafters.",
      metricLabel: "Catalog",
      emptyMessage:
        "No recipes match this filter."
    },
    "material-quality": {
      eyebrow: "MATERIAL QUALITY",
      title: "Reagent Quality Planner",
      description:
        "Inspect recipes with captured quality slots and compare their material scenarios.",
      metricLabel: "Quality-ready",
      emptyMessage:
        "No captured material-quality scenarios match this filter."
    },
    concentration: {
      eyebrow: "CONCENTRATION",
      title: "Concentration Opportunities",
      description:
        "Find crafts that can reach their target by spending concentration.",
      metricLabel: "Opportunities",
      emptyMessage:
        "No concentration opportunities match this filter."
    },
    recommendations: {
      eyebrow: "CRAFT RECOMMENDATIONS",
      title: "Recommended Craft Paths",
      description:
        "Compare the captured material and concentration recommendation for each crafter.",
      metricLabel: "Evaluated",
      emptyMessage:
        "No evaluated craft recommendations match this filter."
    }
  };

export function getRecipeFinderCopy(
  mode: ProfessionRecipeFinderMode
) {
  return finderCopy[mode];
}

export function matchesRecipeFinderMode(
  recipe: ProfessionRecipeCatalogItem,
  mode: ProfessionRecipeFinderMode
) {
  switch (mode) {
    case "material-quality":
      return recipe.crafters.some(
        (crafter) =>
          Boolean(
            crafter.reagentSimulation &&
            (
              crafter.reagentSimulation
                .qualitySlotCount > 0 ||
              crafter.reagentSimulation
                .qualityScenarios.length > 0
            )
          )
      );

    case "concentration":
      return recipe.crafters.some(
        (crafter) =>
          crafter.craftStatus ===
            "CONCENTRATION" ||
          (
            crafter.operation
              .concentrationCost ?? 0
          ) > 0 ||
          crafter.recommendation.kind ===
            "HIGH_MATS_CONCENTRATION"
      );

    case "recommendations":
      return recipe.crafters.some(
        (crafter) =>
          crafter.recommendation.kind !==
          "UNKNOWN"
      );

    default:
      return true;
  }
}

export function matchesRecipeFilters(
  recipe: ProfessionRecipeCatalogItem,
  query: string,
  onlyCraftable: boolean
): boolean {
  if (
    onlyCraftable &&
    recipe.crafters.length === 0
  ) {
    return false;
  }

  const normalizedQuery =
    query
      .trim()
      .toLocaleLowerCase("en");

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    recipe.name,
    recipe.expansion,
    ...recipe.capabilities.map(
      (capability) =>
        capability.name
    ),
    ...recipe.crafters.map(
      (crafter) =>
        crafter.name
    ),
    ...recipe.crafters.map(
      (crafter) =>
        crafter.realm
    )
  ];

  return searchableValues.some(
    (value) =>
      value
        .toLocaleLowerCase("en")
        .includes(normalizedQuery)
  );
}
