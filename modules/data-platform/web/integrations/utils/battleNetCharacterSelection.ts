import type {
  BattleNetCharacterPreview
} from "../types/battlenet.types";

export type BattleNetCharacterFilterState = {
  search: string;
  realm: string;
  className: string;
  minimumLevel: number;
};

export function normalizeBattleNetFilterValue(
  value: string
): string {
  return value
    .trim()
    .toLocaleLowerCase(
      "en-GB"
    );
}

export function createBattleNetFilterOptions(
  values: string[]
): string[] {
  const optionsByKey =
    new Map<string, string>();

  for (const value of values) {
    const trimmedValue =
      value.trim();

    const normalizedValue =
      normalizeBattleNetFilterValue(
        trimmedValue
      );

    if (
      !normalizedValue ||
      optionsByKey.has(
        normalizedValue
      )
    ) {
      continue;
    }

    optionsByKey.set(
      normalizedValue,
      trimmedValue
    );
  }

  return [
    ...optionsByKey.values()
  ].sort(
    (left, right) =>
      left.localeCompare(
        right,
        "en-GB"
      )
  );
}

export function filterBattleNetCharacters(
  characters:
    BattleNetCharacterPreview[],
  filters:
    BattleNetCharacterFilterState
): BattleNetCharacterPreview[] {
  const normalizedSearch =
    normalizeBattleNetFilterValue(
      filters.search
    );

  const normalizedRealm =
    normalizeBattleNetFilterValue(
      filters.realm
    );

  const normalizedClassName =
    normalizeBattleNetFilterValue(
      filters.className
    );

  return characters.filter(
    (character) => {
      if (
        character.level <
        filters.minimumLevel
      ) {
        return false;
      }

      const characterRealm =
        normalizeBattleNetFilterValue(
          character.realm
        );

      if (
        filters.realm !== "ALL" &&
        characterRealm !==
          normalizedRealm
      ) {
        return false;
      }

      const characterClassName =
        normalizeBattleNetFilterValue(
          character.className
        );

      if (
        filters.className !== "ALL" &&
        characterClassName !==
          normalizedClassName
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText =
        normalizeBattleNetFilterValue(
          [
            character.name,
            character.realm,
            character.className
          ].join(" ")
        );

      return searchableText.includes(
        normalizedSearch
      );
    }
  );
}