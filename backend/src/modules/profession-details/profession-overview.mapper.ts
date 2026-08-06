import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type { ProfessionOverviewItem } from "./profession-detail.types.js";

type OverviewRecord =
  Awaited<
    ReturnType<
      ProfessionDetailRepository["findOverview"]
    >
  >[number];

export function mapProfessionOverview(
  records: OverviewRecord[]
): ProfessionOverviewItem[] {
  return records.map((profession) => {
    const trackedCharacterCount =
      profession.assignments.filter(
        (assignment) =>
          assignment.nodeProgress.some(
            (progress) =>
              progress.rank > 0
          )
      ).length;

    const activeNodeCount =
      profession.assignments.reduce(
        (total, assignment) =>
          total +
          assignment.nodeProgress.filter(
            (progress) =>
              progress.rank > 0
          ).length,
        0
      );

    return {
      id: profession.id,
      key: profession.key,
      name: profession.name,
      category: profession.category,
      characterCount:
        profession.assignments.length,
      trackedCharacterCount,
      activeNodeCount
    };
  });
}