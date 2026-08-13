import { env } from "../../../../apps/api/src/config/env.js";
import { DashboardRepository } from "./dashboard.repository.js";

export class DashboardService {
  constructor(
    private readonly repository:
      DashboardRepository
  ) {}

  async getSummary() {
    const [
      characterCount,
      craftingReadyCharacterCount,
      professionAssignmentCount,
      professions
    ] = await Promise.all([
      this.repository
        .countCharacters(),

      this.repository
        .countCraftingReadyCharacters(
          env.CRAFTING_MIN_LEVEL
        ),

      this.repository
        .countProfessionAssignments(),

      this.repository
        .findProfessionCoverage()
    ]);

    const professionCoverage =
      professions.map(
        (profession) => ({
          id: profession.id,
          key: profession.key,
          name: profession.name,
          category:
            profession.category,
          assignmentCount:
            profession
              ._count
              .assignments
        })
      );

    return {
      characterCount,
      craftingReadyCharacterCount,
      professionAssignmentCount,
      coveredProfessionCount:
        professionCoverage.filter(
          (profession) =>
            profession
              .assignmentCount > 0
        ).length,
      totalProfessionCount:
        professionCoverage.length,
      minimumCraftingLevel:
        env.CRAFTING_MIN_LEVEL,
      professionCoverage
    };
  }
}