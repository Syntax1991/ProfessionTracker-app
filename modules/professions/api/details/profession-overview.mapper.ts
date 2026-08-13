import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCaptureStatus,
  ProfessionOverviewItem
} from "./profession-detail.types.js";
import {
  TRACKED_PROFESSION_DATA_SOURCE
} from "./profession-expansion.constants.js";

type OverviewRecord =
  Awaited<
    ReturnType<
      ProfessionDetailRepository["findOverview"]
    >
  >[number];

type OverviewNodeProgress =
  OverviewRecord[
    "assignments"
  ][number][
    "nodeProgress"
  ][number];

function getLastCapturedAt(
  profession: OverviewRecord
): string | null {
  const capturedDates =
    profession.recipes
      .filter(
        (recipe) =>
          recipe.source ===
            TRACKED_PROFESSION_DATA_SOURCE &&
          recipe.lastSyncedAt !==
            null
      )
      .map(
        (recipe) =>
          recipe.lastSyncedAt as Date
      );

  if (
    capturedDates.length ===
    0
  ) {
    return null;
  }

  const latestTimestamp =
    Math.max(
      ...capturedDates.map(
        (date) =>
          date.getTime()
      )
    );

  return new Date(
    latestTimestamp
  ).toISOString();
}

function getCaptureStatus(
  category: string,
  lastCapturedAt: string | null
): ProfessionCaptureStatus {
  if (
    category ===
    "GATHERING"
  ) {
    return "NOT_REQUIRED";
  }

  return lastCapturedAt
    ? "CAPTURED"
    : "NOT_CAPTURED";
}

export function mapProfessionOverview(
  records: OverviewRecord[]
): ProfessionOverviewItem[] {
  return records.map(
    (
      profession
    ) => {
      const trackedCharacterCount =
        profession.assignments.filter(
          (
            assignment
          ) =>
            hasTrackedData(
              assignment
            )
        ).length;

      const activeNodeCount =
        profession.assignments.reduce(
          (
            total,
            assignment
          ) =>
            total +
            assignment.nodeProgress.filter(
              (
                progress
              ) =>
                getInvestedSkillPoints(
                  progress
                ) > 0
            ).length,
          0
        );

      const lastCapturedAt =
        getLastCapturedAt(
          profession
        );

      return {
        id:
          profession.id,

        key:
          profession.key,

        name:
          profession.name,

        category:
          profession.category,

        characterCount:
          profession
            .assignments
            .length,

        trackedCharacterCount,

        activeNodeCount,

        catalogRecipeCount:
          profession
            .recipes
            .length,

        capabilityCount:
          profession
            .capabilities
            .length,

        captureStatus:
          getCaptureStatus(
            profession.category,
            lastCapturedAt
          ),

        lastCapturedAt
      };
    }
  );
}

function hasTrackedData(
  assignment:
    OverviewRecord[
      "assignments"
    ][number]
): boolean {
  return (
    assignment.recipes.length > 0 ||
    assignment.nodeProgress.some(
      (
        progress
      ) =>
        getInvestedSkillPoints(
          progress
        ) > 0
    )
  );
}

function getInvestedSkillPoints(
  progress: OverviewNodeProgress
): number {
  return (
    progress.knowledgeRank ??
    progress.rank
  );
}