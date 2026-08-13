import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { getWeeklyPeriod } from "../shared/weekly-period.js";
import { VaultMythicPlusRepository } from "./vault-mythic-plus.repository.js";
import type {
  MythicPlusRunInput,
  MythicPlusVaultSlot
} from "./vault-mythic-plus.types.js";

const vaultThresholds = [1, 4, 8];

function getVaultSlots(
  keyLevels: number[]
): MythicPlusVaultSlot[] {
  return vaultThresholds.map(
    (threshold) => ({
      threshold,
      unlocked:
        keyLevels.length >= threshold,
      keyLevel:
        keyLevels[threshold - 1] ?? null
    })
  );
}

export class VaultMythicPlusService {
  constructor(
    private readonly repository:
      VaultMythicPlusRepository
  ) {}

  async getOverview() {
    const period = getWeeklyPeriod();
    const characters =
      await this.repository.findCharacters(
        period.key
      );

    const characterItems = characters.map(
      (character) => {
        const runs =
          character.weeklyMythicRuns.map(
            (run) => ({
              id: run.id,
              dungeonName: run.dungeonName,
              keyLevel: run.keyLevel,
              completedAt:
                run.completedAt.toISOString()
            })
          );
        const vaultSlots = getVaultSlots(
          runs.map((run) => run.keyLevel)
        );

        return {
          id: character.id,
          name: character.name,
          realm: character.realm,
          region: character.region,
          className: character.className,
          level: character.level,
          runs,
          vaultSlots,
          highestKeyLevel:
            runs[0]?.keyLevel ?? null
        };
      }
    );

    return {
      period,
      thresholds: vaultThresholds,
      characters: characterItems,
      summary: {
        runCount: characterItems.reduce(
          (total, character) =>
            total + character.runs.length,
          0
        ),
        unlockedSlotCount:
          characterItems.reduce(
            (total, character) =>
              total +
              character.vaultSlots.filter(
                (slot) => slot.unlocked
              ).length,
            0
          ),
        charactersWithVault:
          characterItems.filter(
            (character) =>
              character.vaultSlots[0]
                ?.unlocked === true
          ).length
      }
    };
  }

  async addRun(
    characterId: string,
    input: MythicPlusRunInput
  ) {
    const character =
      await this.repository
        .findCharacterById(characterId);

    if (!character) {
      throw new AppError(
        404,
        "Character not found."
      );
    }

    const period = getWeeklyPeriod();

    await this.repository.createRun(
      characterId,
      period.key,
      input
    );

    return this.getOverview();
  }

  async deleteRun(runId: string) {
    const run =
      await this.repository.findRunById(
        runId
      );
    const period = getWeeklyPeriod();

    if (
      !run ||
      run.periodKey !== period.key
    ) {
      throw new AppError(
        404,
        "Current Mythic+ run not found."
      );
    }

    await this.repository.deleteRun(runId);

    return this.getOverview();
  }
}
