import { env } from "../../../../apps/api/src/config/env.js";
import { DashboardRepository } from "./dashboard.repository.js";

export class DashboardService {
  constructor(
    private readonly repository:
      DashboardRepository
  ) {}

  async getSummary() {
    const [
      craftingReadyCharacterCount,
      professions,
      characters
    ] = await Promise.all([
      this.repository
        .countCraftingReadyCharacters(
          env.CRAFTING_MIN_LEVEL
        ),

      this.repository
        .findProfessionCoverage(),

      this.repository
        .findCharacterOverview()
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

    const characterOverview =
      characters.map(
        (character) => ({
          ...character,
          lastSyncedAt:
            character.lastSyncedAt
              ?.toISOString() ?? null,
          professions:
            [...character.professions]
              .sort((left, right) =>
                left.profession.name.localeCompare(
                  right.profession.name
                )
              )
        })
      );

    return {
      characterCount:
        characterOverview.length,
      craftingReadyCharacterCount,
      syncedCharacterCount:
        characterOverview.filter(
          (character) =>
            character.lastSyncedAt !== null
        ).length,
      realmCount:
        new Set(
          characterOverview.map(
            (character) =>
              `${character.region}:${character.realm}`
          )
        ).size,
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
      professionCoverage,
      characters: characterOverview
    };
  }
}
