import {
  mapProfessionCharacterCoverage,
  type DetailNode
} from "./profession-coverage.mapper.js";
import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCharacterCoverage,
  ProfessionDetailView
} from "./profession-detail.types.js";

type DetailRecord =
  NonNullable<
    Awaited<
      ReturnType<
        ProfessionDetailRepository["findById"]
      >
    >
  >;

export function mapProfessionDetail(
  profession: DetailRecord
): ProfessionDetailView {
  const allNodes =
    profession.specializationTrees.flatMap(
      (tree) =>
        tree.nodes
    );

  const nodeById =
    createNodeMap(
      allNodes
    );

  const treeNameById =
    new Map<string, string>(
      profession.specializationTrees.map(
        (tree) =>
          [
            tree.id,
            tree.name
          ] as const
      )
    );

  const characters =
    profession.assignments
      .map(
        (assignment) =>
          mapProfessionCharacterCoverage(
            assignment,
            nodeById,
            treeNameById,
            allNodes.length > 0
          )
      )
      .sort(
        compareCharacterCoverage
      );

  const trackedCharacterCount =
    characters.filter(
      (character) =>
        character.dataStatus ===
        "TRACKED"
    ).length;

  return {
    profession: {
      id:
        profession.id,

      key:
        profession.key,

      name:
        profession.name,

      category:
        profession.category
    },

    summary: {
      characterCount:
        characters.length,

      trackedCharacterCount,

      missingCharacterCount:
        characters.length -
        trackedCharacterCount,

      specializationCount:
        sumCoverageEntries(
          characters,
          "specializations"
        ),

      slotCount:
        sumCoverageEntries(
          characters,
          "slots"
        )
    },

    characters
  };
}

function createNodeMap(
  nodes: DetailNode[]
): Map<string, DetailNode> {
  return new Map(
    nodes.map(
      (node) =>
        [
          node.id,
          node
        ] as const
    )
  );
}

function sumCoverageEntries(
  characters:
    ProfessionCharacterCoverage[],
  property:
    | "specializations"
    | "slots"
): number {
  return characters.reduce(
    (
      total,
      character
    ) =>
      total +
      character[property].length,
    0
  );
}

function compareCharacterCoverage(
  left: ProfessionCharacterCoverage,
  right: ProfessionCharacterCoverage
): number {
  return (
    left.character.name.localeCompare(
      right.character.name,
      "de"
    ) ||
    left.character.realm.localeCompare(
      right.character.realm,
      "de"
    )
  );
}