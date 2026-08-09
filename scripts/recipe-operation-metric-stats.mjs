export function createMetricStats(
  key
) {
  return {
    key,
    occurrences: 0,
    types:
      new Set(),
    samples:
      new Set(),
    examples: [],
    minimum: null,
    maximum: null
  };
}

export function addMetricValue(
  stats,
  value,
  recipe
) {
  stats.occurrences +=
    1;

  stats.types.add(
    typeof value
  );

  if (
    stats.samples.size <
    5
  ) {
    stats.samples.add(
      String(
        value
      )
    );
  }

  if (
    stats.examples.length <
    5
  ) {
    stats.examples.push({
      profession:
        recipe.profession.name,

      recipe:
        recipe.name,

      gameRecipeId:
        recipe.gameRecipeId,

      value
    });
  }

  if (
    typeof value !==
    "number"
  ) {
    return;
  }

  stats.minimum =
    stats.minimum ===
    null
      ? value
      : Math.min(
          stats.minimum,
          value
        );

  stats.maximum =
    stats.maximum ===
    null
      ? value
      : Math.max(
          stats.maximum,
          value
        );
}

export function parseOperationMetrics(
  recipe
) {
  if (
    !recipe.operationMetricsJson
  ) {
    return null;
  }

  try {
    const value =
      JSON.parse(
        recipe.operationMetricsJson
      );

    if (
      typeof value !==
        "object" ||
      value === null ||
      Array.isArray(
        value
      )
    ) {
      return null;
    }

    return value;
  }
  catch {
    return null;
  }
}

export function createMetricShapeKey(
  metrics
) {
  return Object.keys(
    metrics
  )
    .sort()
    .join(
      "|"
    );
}

export function serializeMetricStats(
  metricStats
) {
  return [
    ...metricStats.values()
  ]
    .sort(
      (
        left,
        right
      ) =>
        right.occurrences -
          left.occurrences ||
        left.key.localeCompare(
          right.key
        )
    )
    .map(
      (stats) => ({
        key:
          stats.key,

        occurrences:
          stats.occurrences,

        types:
          [
            ...stats.types
          ].sort(),

        minimum:
          stats.minimum,

        maximum:
          stats.maximum,

        samples:
          [
            ...stats.samples
          ],

        examples:
          stats.examples
      })
    );
}

export function serializeShapeStats(
  shapeStats
) {
  return [
    ...shapeStats.entries()
  ]
    .map(
      (
        [
          keys,
          occurrences
        ]
      ) => ({
        keys:
          keys
            ? keys.split(
                "|"
              )
            : [],

        occurrences
      })
    )
    .sort(
      (
        left,
        right
      ) =>
        right.occurrences -
        left.occurrences
    );
}

export function calculateMetricCoverage(
  recipeCount,
  recipesWithMetrics
) {
  if (
    recipeCount ===
    0
  ) {
    return 0;
  }

  return Number(
    (
      (
        recipesWithMetrics /
        recipeCount
      ) *
      100
    ).toFixed(
      2
    )
  );
}