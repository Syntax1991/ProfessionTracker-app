import type {
  AddonProfessionCatalog,
  AddonSpecializationNode,
  AddonSpecializationTree,
  LuaTable,
  LuaValue
} from "./addon-import.types.js";
import {
  asNumber,
  asString,
  asTable,
  numericValues
} from "./addon-import.lua-utils.js";

function getEntry(
  node: LuaTable,
  preferredType: number
): LuaTable | null {
  const entries =
    numericValues(
      asTable(node.entries)
    );

  for (const value of entries) {
    const entry =
      asTable(value);

    if (
      entry &&
      asNumber(entry.type) ===
        preferredType
    ) {
      return entry;
    }
  }

  for (const value of entries) {
    const entry =
      asTable(value);

    if (entry) {
      return entry;
    }
  }

  return null;
}

function normalizeNode(
  value: LuaValue,
  rootNodeExternalId:
    number | null,
  sortOrder: number
): AddonSpecializationNode | null {
  const node =
    asTable(value);

  if (
    !node ||
    asNumber(node.type) !== 1
  ) {
    return null;
  }

  const externalNodeId =
    asNumber(node.nodeId);

  if (
    externalNodeId === null
  ) {
    return null;
  }

  const entry =
    getEntry(
      node,
      7
    );

  /*
   * ranksPurchased is a node-level WoW value.
   * Therefore its maximum must also come from
   * the node and not only from the rank entry.
   *
   * Example:
   * node.maxRanks = 31
   * rank-entry.maxRanks = 30
   * ranksPurchased = 31
   */
  const maxRank =
    asNumber(
      node.maxRanks
    ) ??
    asNumber(
      node.totalMaxRanks
    ) ??
    asNumber(
      entry?.maxRanks
    );

  return {
    externalNodeId,
    name:
      asString(
        entry?.name
      ) ??
      `Node ${externalNodeId}`,
    description:
      asString(
        entry?.description
      ),
    maxRank,
    sortOrder,
    isRoot:
      externalNodeId ===
      rootNodeExternalId
  };
}

function normalizeTree(
  value: LuaValue,
  sortOrder: number
): AddonSpecializationTree | null {
  const tree =
    asTable(value);

  if (!tree) {
    return null;
  }

  const externalTreeId =
    asNumber(
      tree.treeId
    );

  if (
    externalTreeId === null
  ) {
    return null;
  }

  const rootNodeExternalId =
    asNumber(
      tree.rootNodeId
    );

  const nodes =
    numericValues(
      asTable(
        tree.nodes
      )
    )
      .map(
        (
          node,
          index
        ) =>
          normalizeNode(
            node,
            rootNodeExternalId,
            (index + 1) * 10
          )
      )
      .filter(
        (
          node
        ): node is AddonSpecializationNode =>
          node !== null
      );

  return {
    externalTreeId,
    name:
      asString(
        tree.name
      ) ??
      `Tree ${externalTreeId}`,
    description:
      asString(
        tree.description
      ),
    rootNodeExternalId,
    sortOrder,
    nodes
  };
}

export function normalizeCatalog(
  key: string,
  value: LuaValue
): AddonProfessionCatalog | null {
  const catalog =
    asTable(value);

  if (!catalog) {
    return null;
  }

  const skillLineId =
    asNumber(
      catalog.skillLineId
    ) ??
    Number(key);

  if (
    !Number.isFinite(
      skillLineId
    )
  ) {
    return null;
  }

  const trees =
    numericValues(
      asTable(
        catalog.tabs
      )
    )
      .map(
        (
          tree,
          index
        ) =>
          normalizeTree(
            tree,
            (index + 1) * 10
          )
      )
      .filter(
        (
          tree
        ): tree is AddonSpecializationTree =>
          tree !== null
      );

  return {
    skillLineId,
    displayName:
      asString(
        catalog.displayName
      ) ??
      `Skill line ${skillLineId}`,
    expansionName:
      asString(
        catalog.expansionName
      ),
    trees
  };
}