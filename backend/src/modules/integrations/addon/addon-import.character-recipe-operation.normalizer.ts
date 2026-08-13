import {
  asNumber,
  asString,
  asTable,
  unixTimestampToIso
} from "./addon-import.lua-utils.js";
import {
  normalizeOperationMetrics
} from "./addon-import.operation-metrics.normalizer.js";
import {
  normalizeCharacterRecipeReagentSimulation
} from "./addon-import.character-recipe-simulation.normalizer.js";
import type {
  AddonCharacterRecipeOperation,
  AddonCharacterRecipeOperationCapture,
  AddonRecipeCatalog,
  AddonRecipeReagentSchema,
  LuaValue
} from "./addon-import.types.js";

type ReagentSchemaMap =
  Map<
    string,
    AddonRecipeReagentSchema | null
  >;

function createReagentSchemaMap(
  recipeCatalogs:
    AddonRecipeCatalog[]
): ReagentSchemaMap {
  const result:
    ReagentSchemaMap =
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
        [
          catalog.skillLineId,
          recipe.gameRecipeId
        ].join(":"),
        recipe.reagentSchema
      );
    }
  }

  return result;
}

function normalizeOperationRecipe(
  skillLineId: number,
  key: string,
  value: LuaValue,
  reagentSchemas:
    ReagentSchemaMap
): AddonCharacterRecipeOperation | null {
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
    ) ??
    Number(
      key
    );

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
          [
            skillLineId,
            gameRecipeId
          ].join(":")
        ) ??
        null
      )
  };
}

function normalizeCapture(
  characterKey: string,
  skillLineKey: string,
  value: LuaValue,
  reagentSchemas:
    ReagentSchemaMap
): AddonCharacterRecipeOperationCapture | null {
  const capture =
    asTable(
      value
    );

  if (!capture) {
    return null;
  }

  const skillLineId =
    asNumber(
      capture.skillLineId
    ) ??
    Number(
      skillLineKey
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
      capture.recipes
    );

  const recipeMap =
    new Map<
      number,
      AddonCharacterRecipeOperation
    >();

  if (recipeTable) {
    for (
      const [
        recipeKey,
        recipeValue
      ] of Object.entries(
        recipeTable
      )
    ) {
      const recipe =
        normalizeOperationRecipe(
          skillLineId,
          recipeKey,
          recipeValue,
          reagentSchemas
        );

      if (recipe) {
        recipeMap.set(
          recipe.gameRecipeId,
          recipe
        );
      }
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
    characterKey,

    skillLineId,

    captureVersion:
      asNumber(
        capture.captureVersion
      ) ??
      0,

    scopeVersion:
      asNumber(
        capture.scopeVersion
      ) ??
      0,

    displayName:
      asString(
        capture.displayName
      ),

    expansionName:
      asString(
        capture.expansionName
      ),

    parentSkillLineId:
      asNumber(
        capture.parentSkillLineId
      ),

    parentProfessionName:
      asString(
        capture.parentProfessionName
      ),

    status:
      asString(
        capture.status
      ),

    learnedRecipeCount:
      asNumber(
        capture.learnedRecipeCount
      ) ??
      0,

    operationEligibleCount:
      asNumber(
        capture.operationEligibleCount
      ) ??
      0,

    operationRecipeCount:
      asNumber(
        capture.operationRecipeCount
      ) ??
      recipes.length,

    capturedAt:
      unixTimestampToIso(
        capture.capturedAt
      ),

    recipes
  };
}

export function normalizeCharacterRecipeOperations(
  value: LuaValue | undefined,
  recipeCatalogs:
    AddonRecipeCatalog[] = []
): AddonCharacterRecipeOperationCapture[] {
  const root =
    asTable(
      value
    );

  if (!root) {
    return [];
  }

  const reagentSchemas =
    createReagentSchemaMap(
      recipeCatalogs
    );

  const captures:
    AddonCharacterRecipeOperationCapture[] =
    [];

  for (
    const [
      characterKey,
      characterValue
    ] of Object.entries(
      root
    )
  ) {
    const characterCaptures =
      asTable(
        characterValue
      );

    if (!characterCaptures) {
      continue;
    }

    for (
      const [
        skillLineKey,
        captureValue
      ] of Object.entries(
        characterCaptures
      )
    ) {
      const capture =
        normalizeCapture(
          characterKey,
          skillLineKey,
          captureValue,
          reagentSchemas
        );

      if (capture) {
        captures.push(
          capture
        );
      }
    }
  }

  return captures.sort(
    (
      left,
      right
    ) =>
      left.characterKey.localeCompare(
        right.characterKey
      ) ||
      left.skillLineId -
        right.skillLineId
  );
}