import { normalizeCatalog } from "./addon-import.catalog.normalizer.js";
import { normalizeCharacter } from "./addon-import.character.normalizer.js";
import {
  asNumber,
  asString,
  asTable,
  inferProfessionKeyFromName
} from "./addon-import.lua-utils.js";
import type {
  AddonCharacter,
  AddonProfessionCatalog,
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
            ([key, value]) =>
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
            (left, right) =>
              left.skillLineId -
              right.skillLineId
          )
      : [];

  const characters =
    characterTable
      ? Object.entries(
          characterTable
        )
          .map(
            ([key, value]) =>
              normalizeCharacter(
                key,
                value
              )
          )
          .filter(
            (
              character
            ): character is AddonCharacter =>
              character !== null
          )
          .sort(
            (left, right) =>
              left.name.localeCompare(
                right.name,
                "de"
              )
          )
      : [];

  const client =
    asTable(root.client);

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
    characters
  };
}

export function inferProfessionKeyFromCatalog(
  catalog:
    AddonProfessionCatalog,
  snapshot:
    AddonSnapshot
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
            catalog.skillLineId
        )
      ) {
        return profession.professionKey;
      }
    }
  }

  return inferProfessionKeyFromName(
    catalog.displayName
  );
}