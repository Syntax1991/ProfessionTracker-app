import type {
  AddonExpansion,
  AddonNodeProgress,
  LuaTable,
  LuaValue
} from "./addon-import.types.js";
import {
  asNumber,
  asString,
  asTable,
  numericValues,
  unixTimestampToIso
} from "./addon-import.lua-utils.js";

function normalizeProgress(
  tabStates: LuaTable | null
): AddonNodeProgress[] {
  const progress:
    AddonNodeProgress[] = [];

  for (
    const stateValue of
    numericValues(tabStates)
  ) {
    const state =
      asTable(
        stateValue
      );

    if (!state) {
      continue;
    }

    const externalTreeId =
      asNumber(
        state.treeId
      );

    const nodeRanks =
      asTable(
        state.nodeRanks
      );

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
      ] of
      Object.entries(
        nodeRanks
      )
    ) {
      const rankState =
        asTable(
          rankValue
        );

      const externalNodeId =
        Number(
          nodeKey
        );

      const rank =
        asNumber(
          rankState
            ?.ranksPurchased
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

function normalizeKnowledgeSpent(
  tabStates: LuaTable | null
): number | null {
  let highestSpent:
    number | null = null;

  for (
    const stateValue of
    numericValues(tabStates)
  ) {
    const state =
      asTable(
        stateValue
      );

    if (!state) {
      continue;
    }

    const currencies =
      numericValues(
        asTable(
          state.currencies
        )
      );

    for (
      const currencyValue of
      currencies
    ) {
      const currency =
        asTable(
          currencyValue
        );

      if (!currency) {
        continue;
      }

      const spent =
        asNumber(
          currency.spent
        );

      if (
        spent === null
      ) {
        continue;
      }

      const maxQuantity =
        asNumber(
          currency.maxQuantity
        );

      /*
       * Unlock currencies are capped.
       * Profession Knowledge is the uncapped
       * trait currency and may be repeated
       * on multiple specialization tabs.
       */
      if (
        maxQuantity !== null &&
        maxQuantity > 0
      ) {
        continue;
      }

      if (
        highestSpent === null ||
        spent > highestSpent
      ) {
        highestSpent =
          spent;
      }
    }
  }

  return highestSpent;
}

export function normalizeExpansion(
  key: string,
  value: LuaValue
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
      tabStates
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
        entry.rank,
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