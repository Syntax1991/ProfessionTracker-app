import {
  compareRecipeMetricValues
} from "./character-recipe-operation-value-comparison.mjs";

function groupRowsByRecipe(recipeRows) {
  const groups = new Map();

  for (const row of recipeRows) {
    let group = groups.get(row.recipeId);

    if (!group) {
      group = [];
      groups.set(row.recipeId, group);
    }

    group.push(row);
  }

  return groups;
}

function uniqueCharacterRows(rows) {
  const byCharacter = new Map();

  for (const row of rows) {
    byCharacter.set(row.characterKey, row);
  }

  return [...byCharacter.values()];
}

function createKeyStat(key) {
  return {
    key,
    comparedRecipes: 0,
    differingRecipes: 0
  };
}

function updateKeyStats(
  stats,
  comparedKeys,
  differingKeys
) {
  const differingSet = new Set(differingKeys);

  for (const key of comparedKeys) {
    let item = stats.get(key);

    if (!item) {
      item = createKeyStat(key);
      stats.set(key, item);
    }

    item.comparedRecipes += 1;

    if (differingSet.has(key)) {
      item.differingRecipes += 1;
    }
  }
}

function serializeKeyStats(stats) {
  return [...stats.values()]
    .map((item) => ({
      key: item.key,
      comparedRecipes: item.comparedRecipes,
      differingRecipes: item.differingRecipes,
      equalRecipes:
        item.comparedRecipes -
        item.differingRecipes,
      classification:
        item.differingRecipes > 0
          ? "VARIES_BETWEEN_CHARACTERS"
          : "NO_VARIATION_OBSERVED"
    }))
    .sort(
      (left, right) =>
        right.differingRecipes -
          left.differingRecipes ||
        right.comparedRecipes -
          left.comparedRecipes ||
        left.key.localeCompare(right.key)
    );
}

function createDifferingRecipe(
  recipeId,
  rows,
  comparison
) {
  return {
    recipeId,
    recipeName: rows[0].recipeName,
    professionName: rows[0].professionName,
    characterCount: rows.length,
    differingKeys: comparison.differingKeys,
    values: comparison.values
  };
}

export function buildRecipeComparisons(recipeRows) {
  const groups = groupRowsByRecipe(recipeRows);
  const keyStats = new Map();
  const differingRecipes = [];

  let comparedRecipeCount = 0;

  for (const [recipeId, group] of groups) {
    const rows = uniqueCharacterRows(group);

    if (rows.length < 2) {
      continue;
    }

    comparedRecipeCount += 1;

    const comparison =
      compareRecipeMetricValues(rows);

    updateKeyStats(
      keyStats,
      comparison.comparedKeys,
      comparison.differingKeys
    );

    if (comparison.differingKeys.length === 0) {
      continue;
    }

    differingRecipes.push(
      createDifferingRecipe(
        recipeId,
        rows,
        comparison
      )
    );
  }

  differingRecipes.sort(
    (left, right) =>
      right.differingKeys.length -
        left.differingKeys.length ||
      left.recipeId - right.recipeId
  );

  return {
    comparedRecipeCount,
    metricComparisons:
      serializeKeyStats(keyStats),
    differingRecipes:
      differingRecipes.slice(0, 100)
  };
}