import type {
  AddonExpansion,
  AddonProfessionCatalog,
  LuaValue
} from "./addon-import.types.js";
import {
  asNumber,
  asString,
  asTable,
  unixTimestampToIso
} from "./addon-import.lua-utils.js";
import {
  normalizeKnowledgeSpent,
  normalizeProgress
} from "./addon-import.progress.normalizer.js";

export function normalizeExpansion(
  key: string,
  value: LuaValue,
  catalog:
    AddonProfessionCatalog | null
): AddonExpansion | null {
  const expansion =
    asTable(
      value
    );

  if (!expansion) {
    return null;
  }

  const skillLineId =
    asNumber(
      expansion.skillLineId
    ) ??
    Number(
      key
    );

  if (
    !Number.isFinite(
      skillLineId
    )
  ) {
    return null;
  }

  const tabStates =
    asTable(
      expansion.tabStates
    );

  const progress =
    normalizeProgress(
      tabStates,
      catalog
    );

  const knowledge =
    asTable(
      expansion.knowledge
    );

  const fallbackInvestedKnowledge =
    progress.reduce(
      (
        total,
        entry
      ) =>
        total +
        entry.knowledgeRank,
      0
    );

  const investedKnowledge =
    normalizeKnowledgeSpent(
      tabStates
    ) ??
    fallbackInvestedKnowledge;

  return {
    skillLineId,

    displayName:
      asString(
        expansion.displayName
      ) ??
      `Skill line ${skillLineId}`,

    expansionName:
      asString(
        expansion.expansionName
      ),

    knowledgeAvailable:
      asNumber(
        knowledge?.available
      ) ??
      0,

    investedKnowledge,
    progress,

    capturedAt:
      unixTimestampToIso(
        expansion.capturedAt
      )
  };
}