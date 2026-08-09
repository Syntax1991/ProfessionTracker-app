import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
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

export type ProfessionSlotCoverageResult = {
  slots: ProfessionCoverageEntry[];
  hasNonSlotProgress: boolean;
};

export function mapProfessionSlotCoverage(
  assignment: DetailAssignment
): ProfessionSlotCoverageResult {
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
    const skillPoints =
      progress.knowledgeRank ??
      progress.rank;

    /*
     * A specialization can be unlocked without
     * any Profession Knowledge invested in it.
     * Zero-point nodes must not count as coverage.
     */
    if (skillPoints <= 0) {
      continue;
    }

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

        skillPoints,

        maxSkillPoints:
          progress.node
            .knowledgeMaxRank ??
          progress.node.maxRank,

        unlocked:
          progress.rank > 0 ||
          (
            progress.unlockRank ??
            0
          ) > 0,

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

  return {
    slots:
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
      ),

    hasNonSlotProgress
  };
}

function shouldReplaceSlot(
  candidate:
    ProfessionCoverageEntry,
  existing:
    ProfessionCoverageEntry
): boolean {
  if (
    candidate.skillPoints !==
    existing.skillPoints
  ) {
    return (
      candidate.skillPoints >
      existing.skillPoints
    );
  }

  if (
    candidate.maxSkillPoints !==
    existing.maxSkillPoints
  ) {
    if (
      candidate.maxSkillPoints ===
      null
    ) {
      return false;
    }

    if (
      existing.maxSkillPoints ===
      null
    ) {
      return true;
    }

    return (
      candidate.maxSkillPoints >
      existing.maxSkillPoints
    );
  }

  return (
    candidate.source ===
      "ADDON" &&
    existing.source !==
      "ADDON"
  );
}