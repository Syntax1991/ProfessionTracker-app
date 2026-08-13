import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";

const currentFile =
  fileURLToPath(
    import.meta.url
  );

const projectRoot =
  path.resolve(
    path.dirname(
      currentFile
    ),
    ".."
  );

const backendRoot =
  path.join(
    projectRoot,
    "apps/api"
  );

const savedVariablesPath =
  process.argv[2];

if (!savedVariablesPath) {
  throw new Error(
    "SavedVariables path is required."
  );
}

if (
  !fs.existsSync(
    savedVariablesPath
  )
) {
  throw new Error(
    `SavedVariables file does not exist: ${savedVariablesPath}`
  );
}

const parserUrl =
  pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      "modules",
      "data-platform",
      "api",
      "integrations",
      "addon",
      "lua-saved-variables.parser.js"
    )
  ).href;

const normalizerUrl =
  pathToFileURL(
    path.join(
      backendRoot,
      "dist",
      "modules",
      "data-platform",
      "api",
      "integrations",
      "addon",
      "addon-import.normalizer.js"
    )
  ).href;

const {
  LuaSavedVariablesParser
} =
  await import(
    parserUrl
  );

const {
  normalizeAddonSnapshot
} =
  await import(
    normalizerUrl
  );

const source =
  fs.readFileSync(
    savedVariablesPath,
    "utf8"
  );

const root =
  new LuaSavedVariablesParser(
    source
  ).parse();

const snapshot =
  normalizeAddonSnapshot(
    root
  );

const metricStats =
  new Map();

let recipeCount =
  0;

let recipesWithMetrics =
  0;

for (
  const catalog of
  snapshot.recipeCatalogs
) {
  for (
    const recipe of
    catalog.recipes
  ) {
    recipeCount +=
      1;

    const entries =
      Object.entries(
        recipe.operationMetrics
      );

    if (
      entries.length >
      0
    ) {
      recipesWithMetrics +=
        1;
    }

    for (
      const [
        key,
        value
      ] of
      entries
    ) {
      let stats =
        metricStats.get(
          key
        );

      if (!stats) {
        stats = {
          key,
          occurrences: 0,
          types:
            new Set(),
          samples:
            new Set(),
          minimum: null,
          maximum: null
        };

        metricStats.set(
          key,
          stats
        );
      }

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
        typeof value ===
        "number"
      ) {
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
    }
  }
}

const keys =
  [
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
          ]
      })
    );

const coveragePercent =
  recipeCount === 0
    ? 0
    : Number(
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

console.log(
  JSON.stringify(
    {
      addonVersion:
        snapshot.addonVersion,

      schemaVersion:
        snapshot.schemaVersion,

      recipeCatalogs:
        snapshot
          .recipeCatalogs
          .length,

      recipeCount,

      recipesWithMetrics,

      coveragePercent,

      metricKeyCount:
        keys.length,

      keys
    },
    null,
    2
  )
);

if (
  recipesWithMetrics ===
  0
) {
  console.warn("");
  console.warn(
    "No recipe operation metrics were captured."
  );
}
