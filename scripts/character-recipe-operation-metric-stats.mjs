function createMetric(key) {
  return {
    key,
    occurrences: 0,
    characters: new Set(),
    recipes: new Set(),
    types: new Set(),
    samples: new Set(),
    minimum: null,
    maximum: null
  };
}

function updateNumericRange(item, value) {
  if (typeof value !== "number") {
    return;
  }

  item.minimum = item.minimum === null
    ? value
    : Math.min(item.minimum, value);

  item.maximum = item.maximum === null
    ? value
    : Math.max(item.maximum, value);
}

function updateMetric(stats, row, key, value) {
  let item = stats.get(key);

  if (!item) {
    item = createMetric(key);
    stats.set(key, item);
  }

  item.occurrences += 1;
  item.characters.add(row.characterKey);
  item.recipes.add(row.recipeId);
  item.types.add(typeof value);

  if (item.samples.size < 6) {
    item.samples.add(String(value));
  }

  updateNumericRange(item, value);
}

function serializeMetric(item) {
  return {
    key: item.key,
    occurrences: item.occurrences,
    characterCount: item.characters.size,
    recipeCount: item.recipes.size,
    types: [...item.types].sort(),
    minimum: item.minimum,
    maximum: item.maximum,
    samples: [...item.samples]
  };
}

export function buildMetricStats(recipeRows) {
  const stats = new Map();

  for (const row of recipeRows) {
    for (const [key, value] of Object.entries(row.metrics)) {
      updateMetric(stats, row, key, value);
    }
  }

  return [...stats.values()]
    .sort(
      (left, right) =>
        right.occurrences - left.occurrences ||
        left.key.localeCompare(right.key)
    )
    .map(serializeMetric);
}