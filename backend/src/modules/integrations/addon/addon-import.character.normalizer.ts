import type {
  AddonCharacter,
  AddonExpansion,
  AddonNodeProgress,
  AddonProfession,
  LuaTable,
  LuaValue
} from "./addon-import.types.js";
import {
  asNumber,
  asString,
  asTable,
  normalizeProfessionKey,
  numericValues,
  unixTimestampToIso
} from "./addon-import.lua-utils.js";

function normalizeProgress(
  tabStates:
    LuaTable | null
): AddonNodeProgress[] {
  const progress:
    AddonNodeProgress[] = [];

  for (
    const stateValue of
    numericValues(tabStates)
  ) {
    const state =
      asTable(stateValue);

    if (!state) {
      continue;
    }

    const externalTreeId =
      asNumber(state.treeId);

    const nodeRanks =
      asTable(state.nodeRanks);

    if (
      externalTreeId === null ||
      !nodeRanks
    ) {
      continue;
    }

    for (
      const [
        nodeKey,
        rankValue
      ] of Object.entries(nodeRanks)
    ) {
      const rankState =
        asTable(rankValue);

      const externalNodeId =
        Number(nodeKey);

      const rank =
        asNumber(
          rankState?.ranksPurchased
        ) ??
        0;

      if (
        !Number.isFinite(
          externalNodeId
        ) ||
        rank <= 0
      ) {
        continue;
      }

      progress.push({
        externalTreeId,
        externalNodeId,
        rank
      });
    }
  }

  return progress;
}

function normalizeExpansion(
  key: string,
  value: LuaValue
): AddonExpansion | null {
  const expansion =
    asTable(value);

  if (!expansion) {
    return null;
  }

  const skillLineId =
    asNumber(
      expansion.skillLineId
    ) ??
    Number(key);

  if (
    !Number.isFinite(
      skillLineId
    )
  ) {
    return null;
  }

  const progress =
    normalizeProgress(
      asTable(
        expansion.tabStates
      )
    );

  const knowledge =
    asTable(
      expansion.knowledge
    );

  const investedKnowledge =
    progress.reduce(
      (total, entry) =>
        total + entry.rank,
      0
    );

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

function normalizeProfession(
  value: LuaValue
): AddonProfession | null {
  const profession =
    asTable(value);

  if (!profession) {
    return null;
  }

  const name =
    asString(
      profession.name
    ) ??
    "Unknown";

  const expansionTable =
    asTable(
      profession.expansions
    );

  const expansions =
    expansionTable
      ? Object.entries(
          expansionTable
        )
          .map(
            ([
              key,
              expansion
            ]) =>
              normalizeExpansion(
                key,
                expansion
              )
          )
          .filter(
            (
              expansion
            ): expansion is AddonExpansion =>
              expansion !== null
          )
          .sort(
            (left, right) =>
              left.skillLineId -
              right.skillLineId
          )
      : [];

  return {
    name,
    professionKey:
      normalizeProfessionKey(
        name
      ),
    skillLineId:
      asNumber(
        profession.skillLineId
      ),
    skillLevel:
      asNumber(
        profession.skillLevel
      ) ??
      0,
    maxSkillLevel:
      asNumber(
        profession.maxSkillLevel
      ) ??
      0,
    skillModifier:
      asNumber(
        profession.skillModifier
      ) ??
      0,
    activeExpansionSkillLineId:
      asNumber(
        profession
          .activeExpansionSkillLineId
      ),
    expansions
  };
}

export function normalizeCharacter(
  key: string,
  value: LuaValue
): AddonCharacter | null {
  const character =
    asTable(value);

  if (!character) {
    return null;
  }

  const professions =
    numericValues(
      asTable(
        character.professions
      )
    )
      .map(
        normalizeProfession
      )
      .filter(
        (
          profession
        ): profession is AddonProfession =>
          profession !== null
      );

  return {
    key,
    name:
      asString(character.name) ??
      key,
    realm:
      asString(character.realm) ??
      "Unknown",
    region:
      (
        asString(character.region) ??
        "EU"
      ).toLowerCase(),
    className:
      asString(
        character.className
      ) ??
      "Unknown",
    level:
      asNumber(character.level) ??
      0,
    snapshotReason:
      asString(
        character.snapshotReason
      ),
    lastUpdatedAt:
      unixTimestampToIso(
        character.lastUpdatedAt
      ),
    professions
  };
}