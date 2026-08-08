import type {
  AddonCharacter,
  AddonExpansion,
  AddonNodeProgress,
  AddonProfession,
  AddonProfessionCatalog,
  AddonSnapshot,
  AddonSpecializationNode,
  AddonSpecializationTree,
  LuaTable,
  LuaValue
} from "./addon-import.types.js";

const professionKeys:
  Record<string, string> = {
    alchemy: "alchemy",
    blacksmithing:
      "blacksmithing",
    enchanting:
      "enchanting",
    engineering:
      "engineering",
    inscription:
      "inscription",
    jewelcrafting:
      "jewelcrafting",
    leatherworking:
      "leatherworking",
    tailoring:
      "tailoring",
    herbalism:
      "herbalism",
    mining:
      "mining",
    skinning:
      "skinning"
  };

function asTable(
  value:
    LuaValue | undefined
): LuaTable | null {
  return (
    typeof value === "object" &&
    value !== null
  )
    ? value
    : null;
}

function asString(
  value:
    LuaValue | undefined
): string | null {
  return typeof value === "string"
    ? value
    : null;
}

function asNumber(
  value:
    LuaValue | undefined
): number | null {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? value
    : null;
}

function numericValues(
  table:
    LuaTable | null
): LuaValue[] {
  if (!table) {
    return [];
  }

  return Object.entries(
    table
  )
    .filter(
      ([key]) =>
        /^\d+$/u.test(
          key
        )
    )
    .sort(
      ([left], [right]) =>
        Number(left) -
        Number(right)
    )
    .map(
      ([, value]) =>
        value
    );
}

function unixTimestampToIso(
  value:
    LuaValue | undefined
): string | null {
  const seconds =
    asNumber(value);

  if (
    seconds === null ||
    seconds <= 0
  ) {
    return null;
  }

  const date =
    new Date(
      seconds * 1000
    );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date.toISOString();
}

function normalizeProfessionKey(
  name: string
): string | null {
  return (
    professionKeys[
      name
        .trim()
        .toLowerCase()
    ] ?? null
  );
}

function getEntry(
  node: LuaTable,
  preferredType: number
): LuaTable | null {
  const entries =
    numericValues(
      asTable(
        node.entries
      )
    );

  for (
    const value of
    entries
  ) {
    const entry =
      asTable(value);

    if (
      entry &&
      asNumber(
        entry.type
      ) === preferredType
    ) {
      return entry;
    }
  }

  for (
    const value of
    entries
  ) {
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
    asNumber(
      node.type
    ) !== 1
  ) {
    return null;
  }

  const externalNodeId =
    asNumber(
      node.nodeId
    );

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

  const name =
    asString(
      entry?.name
    ) ??
    `Node ${externalNodeId}`;

  const description =
    asString(
      entry?.description
    );

  const maxRank =
    asNumber(
      entry?.maxRanks
    ) ??
    asNumber(
      node.maxRanks
    );

  return {
    externalNodeId,
    name,
    description,
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
        (node, index) =>
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

function normalizeCatalog(
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
        (tree, index) =>
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

function normalizeProgress(
  tabStates:
    LuaTable | null
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

    const externalTreeId =
      asNumber(
        state?.treeId
      );

    const nodeRanks =
      asTable(
        state?.nodeRanks
      );

    if (
      !state ||
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
        ) ?? 0;

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
      ) ?? 0,
    investedKnowledge:
      progress.reduce(
        (
          total,
          entry
        ) =>
          total +
          entry.rank,
        0
      ),
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
    asTable(
      value
    );

  if (!profession) {
    return null;
  }

  const name =
    asString(
      profession.name
    ) ??
    "Unknown";

  const expansionsTable =
    asTable(
      profession.expansions
    );

  const expansions =
    expansionsTable
      ? Object.entries(
          expansionsTable
        )
          .map(
            (
              [
                key,
                expansion
              ]
            ) =>
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
            (
              left,
              right
            ) =>
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
      ) ?? 0,
    maxSkillLevel:
      asNumber(
        profession.maxSkillLevel
      ) ?? 0,
    skillModifier:
      asNumber(
        profession.skillModifier
      ) ?? 0,
    activeExpansionSkillLineId:
      asNumber(
        profession
          .activeExpansionSkillLineId
      ),
    expansions
  };
}

function normalizeCharacter(
  key: string,
  value: LuaValue
): AddonCharacter | null {
  const character =
    asTable(
      value
    );

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
      asString(
        character.name
      ) ??
      key,
    realm:
      asString(
        character.realm
      ) ??
      "Unknown",
    region:
      (
        asString(
          character.region
        ) ??
        "EU"
      ).toLowerCase(),
    className:
      asString(
        character.className
      ) ??
      "Unknown",
    level:
      asNumber(
        character.level
      ) ?? 0,
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
            (
              [
                key,
                value
              ]
            ) =>
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

  const characters =
    characterTable
      ? Object.entries(
          characterTable
        )
          .map(
            (
              [
                key,
                value
              ]
            ) =>
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
      ) ?? 0,
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
          client
            ?.interfaceVersion
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
        return (
          profession
            .professionKey
        );
      }
    }
  }

  const displayName =
    catalog.displayName
      .toLowerCase();

  for (
    const [
      name,
      key
    ] of
    Object.entries(
      professionKeys
    )
  ) {
    if (
      displayName === name ||
      displayName.endsWith(
        ` ${name}`
      )
    ) {
      return key;
    }
  }

  return null;
}