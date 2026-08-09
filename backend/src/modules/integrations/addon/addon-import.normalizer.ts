import {
  normalizeCatalog
} from "./addon-import.catalog.normalizer.js";
import {
  normalizeCharacter
} from "./addon-import.character.normalizer.js";
import {
  normalizeCharacterRecipeOperations
} from "./addon-import.character-recipe-operation.normalizer.js";
import {
  normalizeRecipeCatalog
} from "./addon-import.recipe.normalizer.js";
import {
  asNumber,
  asString,
  asTable,
  inferProfessionKeyFromName
} from "./addon-import.lua-utils.js";
import type {
  AddonCharacter,
  AddonProfessionCatalog,
  AddonRecipeCatalog,
  AddonSnapshot,
  LuaTable
} from "./addon-import.types.js";

export function normalizeAddonSnapshot(
  root: LuaTable
): AddonSnapshot {
  const catalogTable =
    asTable(
      root.professionCatalog
    );

  const recipeCatalogTable =
    asTable(
      root.recipeCatalog
    );

  const characterTable =
    asTable(
      root.characters
    );

  const catalogs =
    catalogTable
      ? Object.entries(
          catalogTable
        )
          .map(
            ([
              key,
              value
            ]) =>
              normalizeCatalog(
                key,
                value
              )
          )
          .filter(
            (
              catalog
            ): catalog is AddonProfessionCatalog =>
              catalog !== null
          )
          .sort(
            (
              left,
              right
            ) =>
              left.skillLineId -
              right.skillLineId
          )
      : [];

  const recipeCatalogs =
    recipeCatalogTable
      ? Object.entries(
          recipeCatalogTable
        )
          .map(
            ([
              key,
              value
            ]) =>
              normalizeRecipeCatalog(
                key,
                value
              )
          )
          .filter(
            (
              catalog
            ): catalog is AddonRecipeCatalog =>
              catalog !== null
          )
          .sort(
            (
              left,
              right
            ) =>
              left.skillLineId -
              right.skillLineId
          )
      : [];

  const catalogBySkillLineId =
    new Map(
      catalogs.map(
        (catalog) =>
          [
            catalog.skillLineId,
            catalog
          ] as const
      )
    );

  const characters =
    characterTable
      ? Object.entries(
          characterTable
        )
          .map(
            ([
              key,
              value
            ]) =>
              normalizeCharacter(
                key,
                value,
                catalogBySkillLineId
              )
          )
          .filter(
            (
              character
            ): character is AddonCharacter =>
              character !== null
          )
          .sort(
            (
              left,
              right
            ) =>
              left.name.localeCompare(
                right.name,
                "de"
              )
          )
      : [];

  const characterRecipeOperations =
    normalizeCharacterRecipeOperations(
      root.characterRecipeOperations
    );

  const client =
    asTable(
      root.client
    );

  return {
    addonVersion:
      asString(
        root.addonVersion
      ) ??
      "unknown",

    schemaVersion:
      asNumber(
        root.schemaVersion
      ) ??
      0,

    client: {
      version:
        asString(
          client?.version
        ),

      build:
        asString(
          client?.build
        ),

      interfaceVersion:
        asNumber(
          client?.interfaceVersion
        )
    },

    catalogs,
    recipeCatalogs,
    characterRecipeOperations,
    characters
  };
}

function inferProfessionKeyFromSkillLine(
  skillLineId: number,
  snapshot: AddonSnapshot
): string | null {
  for (
    const character of
    snapshot.characters
  ) {
    for (
      const profession of
      character.professions
    ) {
      if (
        profession.professionKey &&
        profession.expansions.some(
          (expansion) =>
            expansion.skillLineId ===
            skillLineId
        )
      ) {
        return profession.professionKey;
      }
    }
  }

  return null;
}

export function inferProfessionKeyFromCatalog(
  catalog:
    AddonProfessionCatalog,
  snapshot:
    AddonSnapshot
): string | null {
  return (
    inferProfessionKeyFromSkillLine(
      catalog.skillLineId,
      snapshot
    ) ??
    inferProfessionKeyFromName(
      catalog.displayName
    )
  );
}

export function inferProfessionKeyFromRecipeCatalog(
  catalog:
    AddonRecipeCatalog,
  snapshot:
    AddonSnapshot
): string | null {
  return (
    inferProfessionKeyFromSkillLine(
      catalog.skillLineId,
      snapshot
    ) ??
    inferProfessionKeyFromName(
      catalog.displayName
    )
  );
}