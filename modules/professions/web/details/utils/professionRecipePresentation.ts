import type {
  ProfessionRecipeCapability,
  ProfessionRecipeCatalogItem
} from "../types/professionRecipe.types";
import {
  professionRecipeFamilyRules,
  professionRecipeNameSlotRules,
  professionRecipeSlotNames
} from "./professionRecipePresentation.rules";

function normalizePresentationValue(
  value: string
): string {
  return value
    .normalize(
      "NFKD"
    )
    .replace(
      /[\u0300-\u036f]/gu,
      ""
    )
    .toLocaleLowerCase(
      "en"
    )
    .replace(
      /[^a-z0-9]+/gu,
      " "
    )
    .trim();
}

function matchesAlias(
  value: string,
  alias: string
): boolean {
  const normalized =
    normalizePresentationValue(
      value
    );

  return (
    ` ${normalized} `
      .includes(
        ` ${alias} `
      )
  );
}

function findFamily(
  capabilities:
    ProfessionRecipeCapability[]
): string | null {
  const explicit =
    capabilities.find(
      (capability) =>
        capability.type ===
        "EQUIPMENT_FAMILY"
    );

  if (explicit) {
    return explicit.name;
  }

  for (
    const capability of
    capabilities
  ) {
    const rule =
      professionRecipeFamilyRules.find(
        (candidate) =>
          candidate.aliases.some(
            (alias) =>
              matchesAlias(
                capability.name,
                alias
              )
          )
      );

    if (rule) {
      return rule.label;
    }
  }

  return null;
}

function findExplicitSlot(
  capabilities:
    ProfessionRecipeCapability[]
): string | null {
  const capability =
    capabilities.find(
      (candidate) =>
        candidate.type ===
          "EQUIPMENT_SLOT" ||
        candidate.slotKey !== null
    );

  if (!capability) {
    return null;
  }

  if (
    capability.slotKey &&
    professionRecipeSlotNames[
      capability.slotKey
    ]
  ) {
    return professionRecipeSlotNames[
      capability.slotKey
    ];
  }

  return capability.name;
}

function inferSlotFromRecipeName(
  name: string
): string | null {
  const rule =
    professionRecipeNameSlotRules.find(
      (candidate) =>
        candidate.aliases.some(
          (alias) =>
            matchesAlias(
              name,
              alias
            )
        )
    );

  return rule?.label ??
    null;
}

function getFallbackGroup(
  recipe:
    ProfessionRecipeCatalogItem
): string {
  const primary =
    recipe.capabilities.find(
      (capability) =>
        capability.isPrimary
    );

  if (primary) {
    return primary.name;
  }

  const preferred =
    recipe.capabilities.find(
      (capability) =>
        capability.type ===
          "PRODUCT_CATEGORY" ||
        capability.type ===
          "RECIPE_GROUP"
    );

  return (
    preferred?.name ??
    recipe.capabilities[0]
      ?.name ??
    "Other"
  );
}

export function getProfessionRecipeFamilyName(
  recipe:
    ProfessionRecipeCatalogItem
): string | null {
  return findFamily(
    recipe.capabilities
  );
}

export function getProfessionRecipeSlotName(
  recipe:
    ProfessionRecipeCatalogItem
): string | null {
  return (
    findExplicitSlot(
      recipe.capabilities
    ) ??
    inferSlotFromRecipeName(
      recipe.name
    )
  );
}

export function getProfessionRecipeProductLabel(
  recipe:
    ProfessionRecipeCatalogItem
): string {
  const family =
    getProfessionRecipeFamilyName(
      recipe
    );

  const slot =
    getProfessionRecipeSlotName(
      recipe
    );

  if (
    family &&
    slot
  ) {
    return (
      `${family} · ${slot}`
    );
  }

  if (slot) {
    return slot;
  }

  if (family) {
    return family;
  }

  return getFallbackGroup(
    recipe
  );
}

export function getProfessionRecipeGroupName(
  recipe:
    ProfessionRecipeCatalogItem
): string {
  return (
    getProfessionRecipeFamilyName(
      recipe
    ) ??
    getFallbackGroup(
      recipe
    )
  );
}