import {
  isLuaTable,
  luaEntries,
  luaValues,
  numberOrNull,
  scalarObject,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

function buildRecipeIndex(root) {
  const index = new Map();

  for (const catalog of luaValues(root.recipeCatalog)) {
    if (!isLuaTable(catalog)) {
      continue;
    }

    for (const recipe of luaValues(catalog.recipes)) {
      if (!isLuaTable(recipe)) {
        continue;
      }

      const recipeId =
        numberOrNull(recipe.recipeId);

      if (recipeId === null) {
        continue;
      }

      index.set(recipeId, {
        recipeId,
        name:
          stringOrNull(recipe.name),
        categoryName:
          stringOrNull(recipe.categoryName),
        parentCategoryName:
          stringOrNull(
            recipe.parentCategoryName
          )
      });
    }
  }

  return index;
}

function readUnavailableIds(capture) {
  return luaValues(
    capture.operationUnavailableRecipeIds
  )
    .map(numberOrNull)
    .filter((value) => value !== null);
}

function createCaptureRow(
  characterKey,
  capture,
  unavailableIds
) {
  const learnedRecipeCount =
    numberOrNull(
      capture.learnedRecipeCount
    ) ?? 0;

  const operationRecipeCount =
    numberOrNull(
      capture.operationRecipeCount
    ) ?? 0;

  const operationUnavailableCount =
    numberOrNull(
      capture.operationUnavailableCount
    ) ??
    Math.max(
      learnedRecipeCount -
        operationRecipeCount,
      0
    );

  return {
    characterKey,
    captureVersion:
      numberOrNull(
        capture.captureVersion
      ) ?? 1,
    skillLineId:
      numberOrNull(
        capture.skillLineId
      ),
    professionName:
      stringOrNull(
        capture.displayName
      ) ??
      stringOrNull(
        capture.parentProfessionName
      ) ??
      "Unknown profession",
    parentProfessionName:
      stringOrNull(
        capture.parentProfessionName
      ),
    expansionName:
      stringOrNull(
        capture.expansionName
      ),
    captureLevel:
      stringOrNull(
        capture.captureLevel
      ),
    status:
      stringOrNull(
        capture.status
      ),
    learnedRecipeCount,
    operationAttemptedCount:
      numberOrNull(
        capture.operationAttemptedCount
      ) ??
      learnedRecipeCount,
    operationRecipeCount,
    operationUnavailableCount,
    exactUnavailableRecipeIds:
      unavailableIds,
    capturedAt:
      numberOrNull(
        capture.capturedAt
      )
  };
}

function appendRecipeRows(
  target,
  captureRow,
  capture,
  recipeIndex
) {
  for (const recipe of luaValues(capture.recipes)) {
    if (!isLuaTable(recipe)) {
      continue;
    }

    const recipeId =
      numberOrNull(recipe.recipeId);

    if (recipeId === null) {
      continue;
    }

    const metrics =
      scalarObject(
        recipe.operationMetrics
      );

    if (Object.keys(metrics).length === 0) {
      continue;
    }

    const catalogRecipe =
      recipeIndex.get(recipeId);

    target.push({
      characterKey:
        captureRow.characterKey,
      captureVersion:
        captureRow.captureVersion,
      skillLineId:
        captureRow.skillLineId,
      professionName:
        captureRow.professionName,
      recipeId,
      recipeName:
        catalogRecipe?.name ?? null,
      categoryName:
        catalogRecipe?.categoryName ?? null,
      parentCategoryName:
        catalogRecipe?.parentCategoryName ??
        null,
      metrics
    });
  }
}

function appendUnavailableRows(
  target,
  captureRow,
  recipeIndex
) {
  for (
    const recipeId
    of captureRow.exactUnavailableRecipeIds
  ) {
    const catalogRecipe =
      recipeIndex.get(recipeId);

    target.push({
      characterKey:
        captureRow.characterKey,
      professionName:
        captureRow.professionName,
      skillLineId:
        captureRow.skillLineId,
      recipeId,
      recipeName:
        catalogRecipe?.name ?? null,
      categoryName:
        catalogRecipe?.categoryName ?? null,
      parentCategoryName:
        catalogRecipe?.parentCategoryName ??
        null
    });
  }
}

function buildTotals(
  captures,
  recipeRows,
  unavailableRows
) {
  const characters =
    new Set(
      captures.map(
        (capture) =>
          capture.characterKey
      )
    );

  return {
    characters:
      characters.size,
    captures:
      captures.length,
    captureVersion1:
      captures.filter(
        (capture) =>
          capture.captureVersion === 1
      ).length,
    captureVersion2:
      captures.filter(
        (capture) =>
          capture.captureVersion === 2
      ).length,
    learnedRecipes:
      captures.reduce(
        (sum, capture) =>
          sum +
          capture.learnedRecipeCount,
        0
      ),
    recipeOperations:
      recipeRows.length,
    unavailableOperations:
      captures.reduce(
        (sum, capture) =>
          sum +
          capture.operationUnavailableCount,
        0
      ),
    exactUnavailableRecipeIds:
      unavailableRows.length
  };
}

export function buildCaptureData(root) {
  const recipeIndex =
    buildRecipeIndex(root);

  const captures = [];
  const recipeRows = [];
  const exactUnavailableRows = [];

  for (
    const [
      characterKey,
      characterCaptures
    ]
    of luaEntries(
      root.characterRecipeOperations
    )
  ) {
    if (!isLuaTable(characterCaptures)) {
      continue;
    }

    for (
      const capture
      of luaValues(characterCaptures)
    ) {
      if (!isLuaTable(capture)) {
        continue;
      }

      const unavailableIds =
        readUnavailableIds(capture);

      const captureRow =
        createCaptureRow(
          characterKey,
          capture,
          unavailableIds
        );

      captures.push(captureRow);

      appendRecipeRows(
        recipeRows,
        captureRow,
        capture,
        recipeIndex
      );

      appendUnavailableRows(
        exactUnavailableRows,
        captureRow,
        recipeIndex
      );
    }
  }

  captures.sort(
    (left, right) =>
      left.characterKey.localeCompare(
        right.characterKey
      ) ||
      left.professionName.localeCompare(
        right.professionName
      )
  );

  return {
    captures,
    recipeRows,
    exactUnavailableRows,
    totals:
      buildTotals(
        captures,
        recipeRows,
        exactUnavailableRows
      )
  };
}