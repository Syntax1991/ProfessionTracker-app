import {
  isLuaTable,
  luaEntries,
  luaValues,
  numberOrNull,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

import {
  readRecipeQualitySimulation
} from "./recipe-quality-scenario-parser.mjs";

function buildRecipeIndex(root) {
  const index = new Map();

  for (
    const catalog
    of luaValues(
      root.recipeCatalog
    )
  ) {
    if (!isLuaTable(catalog)) {
      continue;
    }

    for (
      const recipe
      of luaValues(
        catalog.recipes
      )
    ) {
      if (!isLuaTable(recipe)) {
        continue;
      }

      const recipeId =
        numberOrNull(
          recipe.recipeId
        );

      if (recipeId === null) {
        continue;
      }

      index.set(
        recipeId,
        {
          recipeId,

          name:
            stringOrNull(
              recipe.name
            ),

          categoryName:
            stringOrNull(
              recipe.categoryName
            )
        }
      );
    }
  }

  return index;
}

function readRecipe(
  characterKey,
  capture,
  recipe,
  recipeIndex
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

  const simulation =
    readRecipeQualitySimulation(
      recipe.reagentSimulation
    );

  if (!simulation) {
    return null;
  }

  const catalogRecipe =
    recipeIndex.get(
      recipeId
    );

  return {
    characterKey,

    professionName:
      stringOrNull(
        capture.displayName
      ) ??
      stringOrNull(
        capture.parentProfessionName
      ) ??
      "Unknown profession",

    expansionName:
      stringOrNull(
        capture.expansionName
      ),

    recipeId,

    recipeName:
      catalogRecipe?.name ??
      null,

    categoryName:
      catalogRecipe?.categoryName ??
      null,

    simulation
  };
}

function appendCaptureRecipes(
  target,
  characterKey,
  capture,
  recipeIndex
) {
  for (
    const recipe
    of luaValues(
      capture.recipes
    )
  ) {
    const row =
      readRecipe(
        characterKey,
        capture,
        recipe,
        recipeIndex
      );

    if (row) {
      target.push(
        row
      );
    }
  }
}

export function readRecipeQualityScenarioData(
  root
) {
  const recipeIndex =
    buildRecipeIndex(
      root
    );

  const recipes = [];

  for (
    const [
      characterKey,
      captures
    ]
    of luaEntries(
      root.characterRecipeOperations
    )
  ) {
    if (!isLuaTable(captures)) {
      continue;
    }

    for (
      const capture
      of luaValues(
        captures
      )
    ) {
      if (!isLuaTable(capture)) {
        continue;
      }

      appendCaptureRecipes(
        recipes,
        characterKey,
        capture,
        recipeIndex
      );
    }
  }

  return recipes;
}