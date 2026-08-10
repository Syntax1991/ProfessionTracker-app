import {
  isLuaTable,
  luaValues,
  numberOrNull,
  scalarObject,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

function createFieldStats() {
  return new Map();
}

function updateFieldStats(
  stats,
  source
) {
  const fields =
    scalarObject(
      source
    );

  for (
    const [
      key,
      value
    ] of
    Object.entries(
      fields
    )
  ) {
    let item =
      stats.get(
        key
      );

    if (!item) {
      item = {
        key,
        occurrences: 0,
        types:
          new Set(),
        samples:
          new Set()
      };

      stats.set(
        key,
        item
      );
    }

    item.occurrences +=
      1;

    item.types.add(
      typeof value
    );

    if (
      item.samples.size <
      6
    ) {
      item.samples.add(
        String(
          value
        )
      );
    }
  }
}

function serializeFieldStats(
  stats
) {
  return [
    ...stats.values()
  ]
    .map(
      (item) => ({
        key:
          item.key,

        occurrences:
          item.occurrences,

        types:
          [
            ...item.types
          ].sort(),

        samples:
          [
            ...item.samples
          ]
      })
    )
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
    );
}

function inspectRecipe(
  recipe,
  stats
) {
  stats.recipeCount +=
    1;

  const schema =
    recipe.reagentSchema;

  if (!isLuaTable(schema)) {
    return;
  }

  stats.recipesWithSchema +=
    1;

  updateFieldStats(
    stats.schematicFields,
    schema
  );

  const slots =
    luaValues(
      schema.reagentSlots
    );

  let recipeReagentCount =
    0;

  for (
    const slot of
    slots
  ) {
    if (!isLuaTable(slot)) {
      continue;
    }

    stats.reagentSlotCount +=
      1;

    updateFieldStats(
      stats.slotFields,
      slot
    );

    const reagents =
      luaValues(
        slot.reagents
      );

    for (
      const reagent of
      reagents
    ) {
      if (!isLuaTable(reagent)) {
        continue;
      }

      stats.reagentCount +=
        1;

      recipeReagentCount +=
        1;

      updateFieldStats(
        stats.reagentFields,
        reagent
      );
    }
  }

  if (
    stats.sampleRecipes.length <
    15
  ) {
    stats.sampleRecipes.push({
      recipeId:
        numberOrNull(
          recipe.recipeId
        ),

      name:
        stringOrNull(
          recipe.name
        ),

      supportsQualities:
        recipe.supportsQualities ===
        true,

      reagentSlots:
        slots.length,

      reagents:
        recipeReagentCount
    });
  }
}

function createStats() {
  return {
    recipeCatalogCount: 0,
    recipeCount: 0,
    recipesWithSchema: 0,
    reagentSlotCount: 0,
    reagentCount: 0,

    schematicFields:
      createFieldStats(),

    slotFields:
      createFieldStats(),

    reagentFields:
      createFieldStats(),

    sampleRecipes: []
  };
}

function createResult(
  root,
  stats
) {
  const coveragePercent =
    stats.recipeCount ===
    0
      ? 0
      : Number(
          (
            (
              stats.recipesWithSchema /
              stats.recipeCount
            ) *
            100
          ).toFixed(
            2
          )
        );

  return {
    addonVersion:
      stringOrNull(
        root.addonVersion
      ),

    schemaVersion:
      numberOrNull(
        root.schemaVersion
      ),

    recipeCatalogCount:
      stats.recipeCatalogCount,

    recipeCount:
      stats.recipeCount,

    recipesWithSchema:
      stats.recipesWithSchema,

    coveragePercent,

    reagentSlotCount:
      stats.reagentSlotCount,

    reagentCount:
      stats.reagentCount,

    fields: {
      schematic:
        serializeFieldStats(
          stats.schematicFields
        ),

      slots:
        serializeFieldStats(
          stats.slotFields
        ),

      reagents:
        serializeFieldStats(
          stats.reagentFields
        )
    },

    sampleRecipes:
      stats.sampleRecipes
  };
}

export function inspectRecipeReagentSchematics(
  root
) {
  const stats =
    createStats();

  for (
    const catalog of
    luaValues(
      root.recipeCatalog
    )
  ) {
    if (!isLuaTable(catalog)) {
      continue;
    }

    stats.recipeCatalogCount +=
      1;

    for (
      const recipe of
      luaValues(
        catalog.recipes
      )
    ) {
      if (!isLuaTable(recipe)) {
        continue;
      }

      inspectRecipe(
        recipe,
        stats
      );
    }
  }

  return createResult(
    root,
    stats
  );
}