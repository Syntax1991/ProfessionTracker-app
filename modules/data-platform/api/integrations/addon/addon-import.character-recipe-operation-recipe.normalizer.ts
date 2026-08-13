import {
  asNumber,
  asTable
} from "./addon-import.lua-utils.js";
import {
  decodeCharacterRecipeOperationValue
} from "./addon-import.character-recipe-operation-codec.js";
import {
  normalizeOperationMetrics
} from "./addon-import.operation-metrics.normalizer.js";
import {
  normalizeCharacterRecipeReagentSimulation
} from "./addon-import.character-recipe-simulation.normalizer.js";
import type {
  AddonCharacterRecipeOperation,
  AddonRecipeCatalog,
  AddonRecipeReagentSchema,
  LuaValue
} from "./addon-import.types.js";

export type CharacterRecipeReagentSchemaMap =
  Map<
    string,
    AddonRecipeReagentSchema | null
  >;

function createSchemaKey(
  skillLineId: number,
  gameRecipeId: number
): string {
  return [
    skillLineId,
    gameRecipeId
  ].join(":");
}

export function createCharacterRecipeReagentSchemaMap(
  recipeCatalogs:
    AddonRecipeCatalog[]
): CharacterRecipeReagentSchemaMap {
  const result:
    CharacterRecipeReagentSchemaMap =
    new Map();

  for (
    const catalog of
    recipeCatalogs
  ) {
    for (
      const recipe of
      catalog.recipes
    ) {
      result.set(
        createSchemaKey(
          catalog.skillLineId,
          recipe.gameRecipeId
        ),
        recipe.reagentSchema
      );
    }
  }

  return result;
}

export function normalizeCharacterRecipeOperationRecipe(
  skillLineId: number,
  key: string,
  value: LuaValue,
  reagentSchemas:
    CharacterRecipeReagentSchemaMap
): AddonCharacterRecipeOperation | null {
  const fallbackRecipeId =
    Number(key);

  const decoded =
    decodeCharacterRecipeOperationValue(
      value,
      fallbackRecipeId
    );

  const recipe =
    asTable(
      decoded
    );

  if (!recipe) {
    return null;
  }

  const gameRecipeId =
    asNumber(
      recipe.recipeId
    ) ??
    fallbackRecipeId;

  if (
    !Number.isFinite(
      gameRecipeId
    )
  ) {
    return null;
  }

  const operationMetrics =
    normalizeOperationMetrics(
      recipe.operationMetrics
    );

  if (
    Object.keys(
      operationMetrics
    ).length === 0
  ) {
    return null;
  }

  return {
    gameRecipeId,

    operationMetrics,

    reagentSimulation:
      normalizeCharacterRecipeReagentSimulation(
        recipe.reagentSimulation,
        operationMetrics,
        reagentSchemas.get(
          createSchemaKey(
            skillLineId,
            gameRecipeId
          )
        ) ??
        null
      )
  };
}