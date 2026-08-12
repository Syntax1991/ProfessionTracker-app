import {
  familyDefinitions
} from "./recipe-output-slot-definitions.mjs";

export function buildOutputSlotCountMap(
  values
) {
  const counts = {};

  for (const value of values) {
    const key =
      value ??
      "NONE";

    counts[key] =
      (counts[key] ?? 0) +
      1;
  }

  return Object.fromEntries(
    Object.entries(
      counts
    ).sort(
      ([left], [right]) =>
        left.localeCompare(
          right
        )
    )
  );
}

export function buildOutputFamilyCoverage(
  recipes
) {
  const result = {};

  for (
    const definition of
    familyDefinitions
  ) {
    const rows =
      recipes.filter(
        (recipe) =>
          recipe.family ===
          definition.name
      );

    const withOutputItem =
      rows.filter(
        (recipe) =>
          recipe.outputItemId !==
          null
      );

    const withEquipLoc =
      rows.filter(
        (recipe) =>
          recipe.outputItemEquipLoc !==
          null
      );

    result[
      definition.name
    ] = {
      recipes:
        rows.length,

      withOutputItem:
        withOutputItem.length,

      withEquipLoc:
        withEquipLoc.length,

      missingEquipLoc:
        rows.length -
        withEquipLoc.length,

      coveragePercent:
        rows.length === 0
          ? 0
          : Math.round(
              (
                withEquipLoc.length /
                rows.length
              ) *
              10000
            ) / 100
    };
  }

  return result;
}

function parseVersion(
  value
) {
  if (
    typeof value !==
    "string"
  ) {
    return [
      0,
      0,
      0
    ];
  }

  return value
    .split(
      "."
    )
    .slice(
      0,
      3
    )
    .map(
      (part) =>
        Number.parseInt(
          part,
          10
        ) || 0
    );
}

export function isAddonVersionAtLeast(
  value,
  minimum
) {
  const current =
    parseVersion(
      value
    );

  for (
    let index = 0;
    index < 3;
    index += 1
  ) {
    if (
      current[index] >
      minimum[index]
    ) {
      return true;
    }

    if (
      current[index] <
      minimum[index]
    ) {
      return false;
    }
  }

  return true;
}