import type {
  AddonNodeProgress,
  AddonProfessionCatalog,
  AddonSpecializationNode,
  LuaTable,
  LuaValue
} from "./addon-import.types.js";
import {
  asNumber,
  asTable,
  numericValues
} from "./addon-import.lua-utils.js";

function findCatalogNode(
  catalog:
    AddonProfessionCatalog | null,
  externalTreeId: number,
  externalNodeId: number
): AddonSpecializationNode | null {
  if (!catalog) {
    return null;
  }

  const tree =
    catalog.trees.find(
      (candidate) =>
        candidate.externalTreeId ===
        externalTreeId
    );

  if (!tree) {
    return null;
  }

  return (
    tree.nodes.find(
      (candidate) =>
        candidate.externalNodeId ===
        externalNodeId
    ) ??
    null
  );
}

function inferKnowledgeRank(
  rankState: LuaTable | null,
  catalogNode:
    AddonSpecializationNode | null
): number {
  const explicitKnowledgeRank =
    asNumber(
      rankState?.knowledgeRank
    );

  if (
    explicitKnowledgeRank !==
    null
  ) {
    return Math.max(
      0,
      explicitKnowledgeRank
    );
  }

  const knowledgeEntryId =
    catalogNode
      ?.knowledgeEntryId ??
    null;

  if (
    knowledgeEntryId ===
    null
  ) {
    return 0;
  }

  const activeEntryId =
    asNumber(
      rankState?.activeEntryId
    );

  if (
    activeEntryId !==
    knowledgeEntryId
  ) {
    return 0;
  }

  return Math.max(
    0,
    asNumber(
      rankState?.activeEntryRank
    ) ??
    0
  );
}

function normalizeNodeProgress(
  externalTreeId: number,
  nodeKey: string,
  rankValue: LuaValue,
  catalog:
    AddonProfessionCatalog | null
): AddonNodeProgress | null {
  const rankState =
    asTable(
      rankValue
    );

  const externalNodeId =
    Number(
      nodeKey
    );

  if (
    !Number.isFinite(
      externalNodeId
    )
  ) {
    return null;
  }

  const rank =
    Math.max(
      0,
      asNumber(
        rankState
          ?.ranksPurchased
      ) ??
      0
    );

  const catalogNode =
    findCatalogNode(
      catalog,
      externalTreeId,
      externalNodeId
    );

  const knowledgeRank =
    inferKnowledgeRank(
      rankState,
      catalogNode
    );

  const explicitUnlockRank =
    asNumber(
      rankState?.unlockRank
    );

  const unlockRank =
    Math.max(
      0,
      explicitUnlockRank ??
      (
        rank -
        knowledgeRank
      )
    );

  if (
    rank <= 0 &&
    knowledgeRank <= 0 &&
    unlockRank <= 0
  ) {
    return null;
  }

  return {
    externalTreeId,
    externalNodeId,
    rank,
    knowledgeRank,
    unlockRank
  };
}

export function normalizeProgress(
  tabStates: LuaTable | null,
  catalog:
    AddonProfessionCatalog | null
): AddonNodeProgress[] {
  const progress:
    AddonNodeProgress[] = [];

  for (
    const stateValue of
    numericValues(
      tabStates
    )
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
      externalTreeId ===
        null ||
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
      const normalizedProgress =
        normalizeNodeProgress(
          externalTreeId,
          nodeKey,
          rankValue as LuaValue,
          catalog
        );

      if (
        normalizedProgress
      ) {
        progress.push(
          normalizedProgress
        );
      }
    }
  }

  return progress;
}

export function normalizeKnowledgeSpent(
  tabStates: LuaTable | null
): number | null {
  let highestSpent:
    number | null = null;

  for (
    const stateValue of
    numericValues(
      tabStates
    )
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

      if (
        maxQuantity !== null &&
        maxQuantity > 0
      ) {
        continue;
      }

      if (
        highestSpent === null ||
        spent >
          highestSpent
      ) {
        highestSpent =
          spent;
      }
    }
  }

  return highestSpent;
}