import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCharacterCoverage,
  ProfessionCoverageEntry
} from "./profession-detail.types.js";
import {
  compareProfessionSlotNames,
  resolveProfessionSlot
} from "./profession-slot.mapper.js";

type DetailRecord =
  NonNullable<
    Awaited<
      ReturnType<
        ProfessionDetailRepository["findById"]
      >
    >
  >;

type DetailAssignment =
  DetailRecord["assignments"][number];

export function mapProfessionCharacterCoverage(
  assignment: DetailAssignment,
  hasCatalog: boolean
): ProfessionCharacterCoverage {
  const slotsByKey =
    new Map<
      string,
      ProfessionCoverageEntry
    >();

  let hasNonSlotProgress =
    false;

  for (
    const progress of
    assignment.nodeProgress
  ) {
    const slot =
      resolveProfessionSlot(
        progress.node.name
      );

    if (!slot) {
      hasNonSlotProgress =
        true;

      continue;
    }

    const entry:
      ProfessionCoverageEntry = {
        id:
          `slot:${slot.key}`,

        name:
          slot.name,

        source:
          progress.source
      };

    const existing =
      slotsByKey.get(
        slot.key
      );

    if (
      !existing ||
      shouldReplaceSlot(
        entry,
        existing
      )
    ) {
      slotsByKey.set(
        slot.key,
        entry
      );
    }
  }

  const slots =
    [
      ...slotsByKey.values()
    ].sort(
      (
        left,
        right
      ) =>
        compareProfessionSlotNames(
          left.name,
          right.name
        )
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
        assignment.character.level
    },

    skill:
      assignment.skill,

    knowledgePoints:
      assignment.knowledgePoints,

    dataStatus:
      resolveDataStatus(
        hasCatalog,
        hasNonSlotProgress,
        slots.length
      ),

    slots
  };
}

function shouldReplaceSlot(
  candidate:
    ProfessionCoverageEntry,
  existing:
    ProfessionCoverageEntry
): boolean {
  return (
    candidate.source ===
      "ADDON" &&
    existing.source !==
      "ADDON"
  );
}

function resolveDataStatus(
  hasCatalog: boolean,
  hasNonSlotProgress: boolean,
  slotCount: number
): ProfessionCharacterCoverage["dataStatus"] {
  if (!hasCatalog) {
    return "NO_CATALOG";
  }

  if (slotCount > 0) {
    return "TRACKED";
  }

  if (hasNonSlotProgress) {
    return "PARTIAL";
  }

  return "UNTRACKED";
}