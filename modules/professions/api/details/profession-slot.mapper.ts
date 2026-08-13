import {
  professionSlotDefinitions,
  type ProfessionSlot
} from "./profession-slot.definitions.js";

const slotOrderByName =
  new Map(
    professionSlotDefinitions.map(
      (slot) =>
        [
          slot.name,
          slot.order
        ] as const
    )
  );

function normalizeSlotText(
  value: string
): string {
  return value
    .normalize(
      "NFKD"
    )
    .replace(
      /[\u0300-\u036f]/gu,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/gu,
      " "
    )
    .trim()
    .replace(
      /\s+/gu,
      " "
    );
}

function matchesAlias(
  normalizedValue: string,
  alias: string
): boolean {
  const normalizedAlias =
    normalizeSlotText(
      alias
    );

  if (
    normalizedValue ===
    normalizedAlias
  ) {
    return true;
  }

  return (
    ` ${normalizedValue} `
      .includes(
        ` ${normalizedAlias} `
      )
  );
}

export function resolveProfessionSlot(
  value: string
): ProfessionSlot | null {
  const normalizedValue =
    normalizeSlotText(
      value
    );

  if (!normalizedValue) {
    return null;
  }

  for (
    const definition of
    professionSlotDefinitions
  ) {
    if (
      definition.aliases.some(
        (alias) =>
          matchesAlias(
            normalizedValue,
            alias
          )
      )
    ) {
      return {
        key:
          definition.key,
        name:
          definition.name,
        order:
          definition.order
      };
    }
  }

  return null;
}

export function compareProfessionSlotNames(
  left: string,
  right: string
): number {
  const leftOrder =
    slotOrderByName.get(
      left
    ) ??
    Number.MAX_SAFE_INTEGER;

  const rightOrder =
    slotOrderByName.get(
      right
    ) ??
    Number.MAX_SAFE_INTEGER;

  return (
    leftOrder -
      rightOrder ||
    left.localeCompare(
      right,
      "en"
    )
  );
}