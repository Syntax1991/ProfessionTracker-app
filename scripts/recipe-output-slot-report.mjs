import {
  numberOrNull,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

import {
  buildOutputFamilyCoverage,
  buildOutputSlotCountMap,
  isAddonVersionAtLeast
} from "./recipe-output-slot-analysis.mjs";

import {
  compareRecipeOutputRows,
  readRecipeOutputSlotCatalog,
  toRecipeOutputSample
} from "./recipe-output-slot-reader.mjs";

export function buildRecipeOutputSlotReport(
  root
) {
  const {
    catalogCount,
    recipes
  } =
    readRecipeOutputSlotCatalog(
      root
    );

  const withOutputItem =
    recipes.filter(
      (recipe) =>
        recipe.outputItemId !==
        null
    );

  const withEquipLoc =
    recipes.filter(
      (recipe) =>
        recipe.outputItemEquipLoc !==
        null
    );

  const familyEquipment =
    recipes.filter(
      (recipe) =>
        recipe.family !==
        null
    );

  const familyWithEquipLoc =
    familyEquipment.filter(
      (recipe) =>
        recipe.outputItemEquipLoc !==
        null
    );

  const familyMissingEquipLoc =
    familyEquipment
      .filter(
        (recipe) =>
          recipe.outputItemEquipLoc ===
          null
      )
      .sort(
        compareRecipeOutputRows
      );

  const exactSamples =
    [...familyWithEquipLoc]
      .sort(
        compareRecipeOutputRows
      )
      .slice(
        0,
        60
      )
      .map(
        toRecipeOutputSample
      );

  const otherEquippable =
    recipes
      .filter(
        (recipe) =>
          recipe.family ===
            null &&
          recipe.outputItemEquipLoc !==
            null
      )
      .sort(
        compareRecipeOutputRows
      )
      .slice(
        0,
        40
      )
      .map(
        toRecipeOutputSample
      );

  const schemaVersion =
    numberOrNull(
      root.schemaVersion
    );

  const addonVersion =
    stringOrNull(
      root.addonVersion
    );

  return {
    addonVersion,

    schemaVersion,

    storageScopeVersion:
      numberOrNull(
        root.storageScopeVersion
      ),

    totals: {
      catalogs:
        catalogCount,

      recipes:
        recipes.length,

      recipesWithOutputItem:
        withOutputItem.length,

      recipesWithEquipLoc:
        withEquipLoc.length,

      familyEquipmentRecipes:
        familyEquipment.length,

      familyEquipmentWithEquipLoc:
        familyWithEquipLoc.length,

      familyEquipmentMissingEquipLoc:
        familyMissingEquipLoc.length
    },

    familyCoverage:
      buildOutputFamilyCoverage(
        recipes
      ),

    equipLocCounts:
      buildOutputSlotCountMap(
        withEquipLoc.map(
          (recipe) =>
            recipe.outputItemEquipLoc
        )
      ),

    validation: {
      addon072OrNewer:
        isAddonVersionAtLeast(
          addonVersion,
          [
            0,
            7,
            2
          ]
        ),

      schema10OrNewer:
        (
          schemaVersion ??
          0
        ) >= 10,

      hasOutputItemIds:
        withOutputItem.length >
        0,

      hasEquipLocs:
        withEquipLoc.length >
        0,

      hasFamilyEquipmentRecipes:
        familyEquipment.length >
        0,

      hasExactFamilyEquipmentSlots:
        familyWithEquipLoc.length >
        0,

      allFamilyEquipmentHaveEquipLoc:
        familyEquipment.length >
          0 &&
        familyMissingEquipLoc.length ===
          0
    },

    missingFamilyEquipmentSlots:
      familyMissingEquipLoc
        .slice(
          0,
          100
        )
        .map(
          toRecipeOutputSample
        ),

    exactFamilySlotSamples:
      exactSamples,

    otherEquippableSamples:
      otherEquippable
  };
}