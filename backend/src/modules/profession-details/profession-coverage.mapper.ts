import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCharacterCoverage,
  ProfessionCoverageEntry,
  ProfessionRecipeCoverage
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

type DetailRecipe =
  DetailAssignment["recipes"][number];

export function mapProfessionCharacterCoverage(
  assignment: DetailAssignment,
  hasSpecializationCatalog: boolean,
  hasRecipeCatalog: boolean
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

        skillPoints:
          progress.knowledgeRank ??
          progress.rank,

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

  const recipes =
    assignment.recipes
      .map(
        mapRecipeCoverage
      )
      .sort(
        compareRecipeCoverage
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
        hasSpecializationCatalog,
        hasRecipeCatalog,
        hasNonSlotProgress,
        slots.length,
        recipes.length
      ),

    slots,
    recipes
  };
}

function mapRecipeCoverage(
  entry: DetailRecipe
): ProfessionRecipeCoverage {
  return {
    id:
      entry.recipe.id,

    gameRecipeId:
      entry.recipe.gameRecipeId,

    name:
      entry.recipe.name,

    skillLineId:
      entry.recipe.skillLineId,

    expansion:
      entry.recipe.expansion,

    categoryId:
      entry.recipe.categoryId,

    source:
      entry.source,

    lastSyncedAt:
      entry.lastSyncedAt
        ?.toISOString() ??
      null
  };
}

function compareRecipeCoverage(
  left:
    ProfessionRecipeCoverage,
  right:
    ProfessionRecipeCoverage
): number {
  return (
    left.expansion.localeCompare(
      right.expansion,
      "de"
    ) ||
    left.name.localeCompare(
      right.name,
      "de"
    ) ||
    left.gameRecipeId -
      right.gameRecipeId
  );
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

function resolveDataStatus(
  hasSpecializationCatalog: boolean,
  hasRecipeCatalog: boolean,
  hasNonSlotProgress: boolean,
  slotCount: number,
  recipeCount: number
): ProfessionCharacterCoverage["dataStatus"] {
  if (
    slotCount > 0 ||
    recipeCount > 0
  ) {
    return "TRACKED";
  }

  if (
    !hasSpecializationCatalog &&
    !hasRecipeCatalog
  ) {
    return "NO_CATALOG";
  }

  if (hasNonSlotProgress) {
    return "PARTIAL";
  }

  return "UNTRACKED";
}