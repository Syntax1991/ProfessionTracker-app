import {
  addMetricValue,
  calculateMetricCoverage,
  createMetricShapeKey,
  createMetricStats,
  parseOperationMetrics,
  serializeMetricStats,
  serializeShapeStats
} from "./recipe-operation-metric-stats.mjs";

function addShape(
  shapeStats,
  metrics
) {
  const shapeKey =
    createMetricShapeKey(
      metrics
    );

  const currentCount =
    shapeStats.get(
      shapeKey
    ) ??
    0;

  shapeStats.set(
    shapeKey,
    currentCount + 1
  );
}

function addRecipeMetrics(
  metricStats,
  recipe,
  metrics
) {
  for (
    const [
      key,
      value
    ] of
    Object.entries(
      metrics
    )
  ) {
    let stats =
      metricStats.get(
        key
      );

    if (!stats) {
      stats =
        createMetricStats(
          key
        );

      metricStats.set(
        key,
        stats
      );
    }

    addMetricValue(
      stats,
      value,
      recipe
    );
  }
}

export function createStoredRecipeOperationMetricReport(
  recipes
) {
  const metricStats =
    new Map();

  const shapeStats =
    new Map();

  let recipesWithMetrics =
    0;

  let invalidMetricRows =
    0;

  for (
    const recipe of
    recipes
  ) {
    if (
      !recipe.operationMetricsJson
    ) {
      continue;
    }

    const metrics =
      parseOperationMetrics(
        recipe
      );

    if (!metrics) {
      invalidMetricRows +=
        1;

      continue;
    }

    const metricCount =
      Object.keys(
        metrics
      ).length;

    if (
      metricCount ===
      0
    ) {
      continue;
    }

    recipesWithMetrics +=
      1;

    addShape(
      shapeStats,
      metrics
    );

    addRecipeMetrics(
      metricStats,
      recipe,
      metrics
    );
  }

  return {
    recipeCount:
      recipes.length,

    recipesWithMetrics,

    coveragePercent:
      calculateMetricCoverage(
        recipes.length,
        recipesWithMetrics
      ),

    invalidMetricRows,

    metricKeyCount:
      metricStats.size,

    keys:
      serializeMetricStats(
        metricStats
      ),

    shapes:
      serializeShapeStats(
        shapeStats
      )
  };
}