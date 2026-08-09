import {
  inferProfessionKeyFromCatalog,
  inferProfessionKeyFromRecipeCatalog
} from "./addon-import.normalizer.js";
import type {
  AddonExpansion,
  AddonProfession,
  AddonSnapshot
} from "./addon-import.types.js";

export function createExpansionKey(
  expansionName: string | null,
  skillLineId: number
): string {
  const normalized =
    (
      expansionName ??
      `SKILL_LINE_${skillLineId}`
    )
      .normalize("NFKD")
      .replace(
        /[\u0300-\u036f]/gu,
        ""
      )
      .replace(
        /[^A-Za-z0-9]+/gu,
        "_"
      )
      .replace(
        /^_+|_+$/gu,
        ""
      )
      .toUpperCase();

  if (
    normalized.includes(
      "MIDNIGHT"
    )
  ) {
    return "MIDNIGHT";
  }

  if (
    normalized.includes(
      "KHAZ_ALGAR"
    ) ||
    normalized.includes(
      "WAR_WITHIN"
    )
  ) {
    return "THE_WAR_WITHIN";
  }

  if (
    normalized.includes(
      "DRAGON_ISLES"
    ) ||
    normalized.includes(
      "DRAGONFLIGHT"
    )
  ) {
    return "DRAGONFLIGHT";
  }

  if (
    normalized.includes(
      "SHADOWLAND"
    )
  ) {
    return "SHADOWLANDS";
  }

  if (
    normalized.includes(
      "KUL_TIRAN"
    ) ||
    normalized.includes(
      "ZANDALARI"
    )
  ) {
    return "BATTLE_FOR_AZEROTH";
  }

  if (
    normalized.includes(
      "LEGION"
    )
  ) {
    return "LEGION";
  }

  if (
    normalized.includes(
      "DRAENOR"
    )
  ) {
    return "WARLORDS_OF_DRAENOR";
  }

  if (
    normalized.includes(
      "PANDARIA"
    )
  ) {
    return "MISTS_OF_PANDARIA";
  }

  if (
    normalized.includes(
      "CATACLYSM"
    )
  ) {
    return "CATACLYSM";
  }

  if (
    normalized.includes(
      "NORTHREND"
    )
  ) {
    return "WRATH_OF_THE_LICH_KING";
  }

  if (
    normalized.includes(
      "OUTLAND"
    )
  ) {
    return "THE_BURNING_CRUSADE";
  }

  return (
    normalized ||
    `SKILL_LINE_${skillLineId}`
  );
}

export function createTreeKey(
  skillLineId: number,
  externalTreeId: number
): string {
  return (
    `addon:${skillLineId}:${externalTreeId}`
  );
}

export function createNodeKey(
  externalNodeId: number
): string {
  return (
    `addon:${externalNodeId}`
  );
}

export function createNodeMapKey(
  skillLineId: number,
  externalTreeId: number,
  externalNodeId: number
): string {
  return [
    skillLineId,
    externalTreeId,
    externalNodeId
  ].join(":");
}

export function getActiveExpansion(
  profession: AddonProfession
): AddonExpansion | null {
  if (
    profession
      .activeExpansionSkillLineId !==
    null
  ) {
    const active =
      profession.expansions.find(
        (expansion) =>
          expansion.skillLineId ===
          profession
            .activeExpansionSkillLineId
      );

    if (active) {
      return active;
    }
  }

  return (
    profession.expansions.at(-1) ??
    null
  );
}

export function getSyncDate(
  value: string | null
): Date {
  if (!value) {
    return new Date();
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return new Date();
  }

  return date;
}

export function collectProfessionKeys(
  snapshot: AddonSnapshot
): string[] {
  const keys =
    new Set<string>();

  for (
    const character of
    snapshot.characters
  ) {
    for (
      const profession of
      character.professions
    ) {
      if (
        profession.professionKey
      ) {
        keys.add(
          profession.professionKey
        );
      }
    }
  }

  for (
    const catalog of
    snapshot.catalogs
  ) {
    const professionKey =
      inferProfessionKeyFromCatalog(
        catalog,
        snapshot
      );

    if (professionKey) {
      keys.add(
        professionKey
      );
    }
  }

  for (
    const catalog of
    snapshot.recipeCatalogs
  ) {
    const professionKey =
      inferProfessionKeyFromRecipeCatalog(
        catalog,
        snapshot
      );

    if (professionKey) {
      keys.add(
        professionKey
      );
    }
  }

  return [
    ...keys
  ];
}