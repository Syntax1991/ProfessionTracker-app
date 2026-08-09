import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type { ProfessionOverviewItem } from "./profession-detail.types.js";

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
            .length
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