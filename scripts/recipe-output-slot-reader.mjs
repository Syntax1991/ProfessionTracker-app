import {
  isLuaTable,
  luaValues,
  numberOrNull,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

import {
  resolveEquipLocLabel,
  resolveOutputFamily
} from "./recipe-output-slot-definitions.mjs";

function readOutputItemId(
  recipe
) {
  const direct =
    numberOrNull(
      recipe.outputItemId
    );

  if (direct !== null) {
    return direct;
  }

  const schema =
    isLuaTable(
      recipe.reagentSchema
    )
      ? recipe.reagentSchema
      : null;

  return schema
    ? numberOrNull(
        schema.outputItemID
      )
    : null;
}

function readRecipe(
  catalog,
  recipe
) {
  if (!isLuaTable(recipe)) {
    return null;
  }

  const recipeId =
    numberOrNull(
      recipe.recipeId
    );

  if (recipeId === null) {
    return null;
  }

  const categoryName =
    stringOrNull(
      recipe.categoryName
    );

  const parentCategoryName =
    stringOrNull(
      recipe.parentCategoryName
    );

  const outputItemEquipLoc =
    stringOrNull(
      recipe.outputItemEquipLoc
    );

  return {
    skillLineId:
      numberOrNull(
        catalog.skillLineId
      ),

    professionName:
      stringOrNull(
        catalog.displayName
      ) ??
      "Unknown profession",

    expansionName:
      stringOrNull(
        catalog.expansionName
      ),

    recipeId,

    recipeName:
      stringOrNull(
        recipe.name
      ),

    categoryName,

    parentCategoryName,

    family:
      resolveOutputFamily(
        categoryName,
        parentCategoryName
      ),

    outputItemId:
      readOutputItemId(
        recipe
      ),

    outputItemEquipLoc,

    slotLabel:
      resolveEquipLocLabel(
        outputItemEquipLoc
      )
  };
}

export function readRecipeOutputSlotCatalog(
  root
) {
  const recipes = [];
  let catalogCount = 0;

  for (
    const catalog of
    luaValues(
      root.recipeCatalog
    )
  ) {
    if (!isLuaTable(catalog)) {
      continue;
    }

    catalogCount += 1;

    for (
      const recipe of
      luaValues(
        catalog.recipes
      )
    ) {
      const row =
        readRecipe(
          catalog,
          recipe
        );

      if (row) {
        recipes.push(
          row
        );
      }
    }
  }

  return {
    catalogCount,
    recipes
  };
}

export function compareRecipeOutputRows(
  left,
  right
) {
  return (
    left.professionName
      .localeCompare(
        right.professionName
      ) ||
    (
      left.categoryName ??
      ""
    ).localeCompare(
      right.categoryName ??
      ""
    ) ||
    (
      left.recipeName ??
      ""
    ).localeCompare(
      right.recipeName ??
      ""
    ) ||
    left.recipeId -
      right.recipeId
  );
}

export function toRecipeOutputSample(
  recipe
) {
  return {
    profession:
      recipe.professionName,

    recipeId:
      recipe.recipeId,

    name:
      recipe.recipeName,

    category:
      recipe.categoryName,

    parentCategory:
      recipe.parentCategoryName,

    family:
      recipe.family,

    outputItemId:
      recipe.outputItemId,

    equipLoc:
      recipe.outputItemEquipLoc,

    slot:
      recipe.slotLabel,

    display:
      recipe.family &&
      recipe.slotLabel
        ? `${recipe.family} · ${recipe.slotLabel}`
        : recipe.slotLabel ??
          recipe.family
  };
}