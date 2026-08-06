import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCharacterCoverage,
  ProfessionCoverageEntry
} from "./profession-detail.types.js";

type DetailRecord =
  NonNullable<
    Awaited<
      ReturnType<
        ProfessionDetailRepository["findById"]
      >
    >
  >;

export type DetailNode =
  DetailRecord[
    "specializationTrees"
  ][number]["nodes"][number];

type DetailAssignment =
  DetailRecord["assignments"][number];

export function mapProfessionCharacterCoverage(
  assignment: DetailAssignment,
  nodeById: Map<string, DetailNode>,
  treeNameById: Map<string, string>,
  parentNodeIds: Set<string>,
  hasCatalog: boolean
): ProfessionCharacterCoverage {
  const specializations:
    ProfessionCoverageEntry[] = [];

  const slots:
    ProfessionCoverageEntry[] = [];

  for (
    const progress of
    assignment.nodeProgress
  ) {
    if (progress.rank <= 0) {
      continue;
    }

    const node =
      nodeById.get(
        progress.nodeId
      );

    if (!node) {
      continue;
    }

    const entry =
      createCoverageEntry(
        node,
        progress.rank,
        progress.source,
        nodeById,
        treeNameById
      );

    if (
      parentNodeIds.has(
        node.id
      )
    ) {
      specializations.push(
        entry
      );
    }
    else {
      slots.push(
        entry
      );
    }
  }

  specializations.sort(
    compareCoverageEntries
  );

  slots.sort(
    compareCoverageEntries
  );

  return {
    characterProfessionId:
      assignment.id,

    character: {
      id:
        assignment.character.id,

      name:
        assignment.character.name,

      realm:
        assignment.character.realm,

      className:
        assignment.character.className,

      level:
        assignment.character.level,

      source:
        assignment.character.source
    },

    skill:
      assignment.skill,

    knowledgePoints:
      assignment.knowledgePoints,

    specializationSummary:
      assignment.specializationSummary,

    dataStatus:
      resolveDataStatus(
        hasCatalog,
        specializations.length,
        slots.length
      ),

    specializations,
    slots
  };
}

function createCoverageEntry(
  node: DetailNode,
  rank: number,
  source: string,
  nodeById: Map<string, DetailNode>,
  treeNameById: Map<string, string>
): ProfessionCoverageEntry {
  return {
    id:
      node.id,

    name:
      node.name,

    path:
      createNodePath(
        node,
        nodeById,
        treeNameById
      ),

    rank,

    maxRank:
      node.maxRank,

    source
  };
}

function createNodePath(
  node: DetailNode,
  nodeById: Map<string, DetailNode>,
  treeNameById: Map<string, string>
): string {
  const pathParts:
    string[] = [];

  const visitedNodeIds =
    new Set<string>();

  let currentNode:
    DetailNode | undefined = node;

  while (
    currentNode &&
    !visitedNodeIds.has(
      currentNode.id
    )
  ) {
    visitedNodeIds.add(
      currentNode.id
    );

    pathParts.unshift(
      currentNode.name
    );

    currentNode =
      currentNode.parentNodeId
        ? nodeById.get(
            currentNode.parentNodeId
          )
        : undefined;
  }

  const treeName =
    treeNameById.get(
      node.treeId
    );

  if (
    treeName &&
    pathParts[0] !== treeName
  ) {
    pathParts.unshift(
      treeName
    );
  }

  return pathParts.join(
    " → "
  );
}

function resolveDataStatus(
  hasCatalog: boolean,
  specializationCount: number,
  slotCount: number
): ProfessionCharacterCoverage["dataStatus"] {
  if (!hasCatalog) {
    return "NO_CATALOG";
  }

  if (slotCount > 0) {
    return "TRACKED";
  }

  if (specializationCount > 0) {
    return "PARTIAL";
  }

  return "UNTRACKED";
}

function compareCoverageEntries(
  left: ProfessionCoverageEntry,
  right: ProfessionCoverageEntry
): number {
  return left.path.localeCompare(
    right.path,
    "de"
  );
}