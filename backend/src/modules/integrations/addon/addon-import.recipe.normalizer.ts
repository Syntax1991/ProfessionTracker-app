import {
  asNumber,
  asString,
  asTable,
  numericValues,
  unixTimestampToIso
} from "./addon-import.lua-utils.js";
import type {
  AddonRecipe,
  AddonRecipeCatalog,
  LuaValue
} from "./addon-import.types.js";

function normalizeRecipe(
  value: LuaValue
): AddonRecipe | null {
  const recipe =
    asTable(
      value
    );

  if (!recipe) {
    return null;
  }

  const gameRecipeId =
    asNumber(
      recipe.recipeId
    );

  if (
    gameRecipeId === null
  ) {
    return null;
  }

  const categoryId =
    asNumber(
      recipe.categoryId
    );

  return {
    gameRecipeId,

    name:
      asString(
        recipe.name
      ) ??
      `Recipe ${gameRecipeId}`,

    categoryId:
      categoryId !== null &&
      categoryId > 0
        ? categoryId
        : null
  };
}

export function normalizeRecipeCatalog(
  key: string,
  value: LuaValue
): AddonRecipeCatalog | null {
  const catalog =
    asTable(
      value
    );

  if (!catalog) {
    return null;
  }

  const skillLineId =
    asNumber(
      catalog.skillLineId
    ) ??
    Number(
      key
    );

  if (
    !Number.isFinite(
      skillLineId
    )
  ) {
    return null;
  }

  const recipeTable =
    asTable(
      catalog.recipes
    );

  const recipeMap =
    new Map<
      number,
      AddonRecipe
    >();

  for (
    const value of
    numericValues(
      recipeTable
    )
  ) {
    const recipe =
      normalizeRecipe(
        value
      );

    if (recipe) {
      recipeMap.set(
        recipe.gameRecipeId,
        recipe
      );
    }
  }

  const recipes =
    [
      ...recipeMap.values()
    ]
      .sort(
        (
          left,
          right
        ) =>
          left.gameRecipeId -
          right.gameRecipeId
      );

  return {
    skillLineId,

    displayName:
      asString(
        catalog.displayName
      ) ??
      `Skill line ${skillLineId}`,

    expansionName:
      asString(
        catalog.expansionName
      ),

    recipes,

    capturedAt:
      unixTimestampToIso(
        catalog.capturedAt
      )
  };
}