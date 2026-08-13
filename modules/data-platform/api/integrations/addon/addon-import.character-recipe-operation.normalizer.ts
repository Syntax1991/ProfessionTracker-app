import {
  asNumber,
  asString,
  asTable,
  unixTimestampToIso
} from "./addon-import.lua-utils.js";
import {
  createCharacterRecipeReagentSchemaMap,
  normalizeCharacterRecipeOperationRecipe
} from "./addon-import.character-recipe-operation-recipe.normalizer.js";
import type {
  AddonCharacterRecipeOperation,
  AddonCharacterRecipeOperationCapture,
  AddonRecipeCatalog,
  LuaValue
} from "./addon-import.types.js";

function normalizeCapture(
  characterKey: string,
  skillLineKey: string,
  value: LuaValue,
  reagentSchemas:
    ReturnType<
      typeof createCharacterRecipeReagentSchemaMap
    >
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
        normalizeCharacterRecipeOperationRecipe(
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
    createCharacterRecipeReagentSchemaMap(
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