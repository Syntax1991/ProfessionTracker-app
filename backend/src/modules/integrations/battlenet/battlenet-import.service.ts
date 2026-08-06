import { env } from "../../../config/env.js";
import { mapWithConcurrency } from "../../../shared/async/mapWithConcurrency.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { CharacterRepository } from "../../characters/character.repository.js";
import { ProfessionRepository } from "../../professions/profession.repository.js";
import { BattleNetClient } from "./battlenet.client.js";
import {
  createBattleNetProfessionAssignments,
  normalizeBattleNetCharacters,
  type ImportableBattleNetCharacter
} from "./battlenet-import.mapper.js";
import { BattleNetRepository } from "./battlenet.repository.js";
import type {
  BattleNetImportFailure,
  BattleNetImportResult
} from "./battlenet.types.js";

const tokenExpiryBufferMilliseconds =
  30 * 1000;

const importConcurrency = 4;

type ImportOutcome = {
  imported: boolean;
  failure: BattleNetImportFailure | null;
};

export class BattleNetImportService {
  constructor(
    private readonly repository:
      BattleNetRepository,

    private readonly client:
      BattleNetClient,

    private readonly characterRepository:
      CharacterRepository,

    private readonly professionRepository:
      ProfessionRepository
  ) {}

  async importCharacters():
    Promise<BattleNetImportResult> {
    const connection =
      await this.getUsableConnection();

    const accountProfile =
      await this.client.getAccountProfile(
        connection.accessToken
      );

    const characters =
      normalizeBattleNetCharacters(
        accountProfile
      );

    const professionIdByKey =
      await this.createProfessionIdMap();

    const outcomes =
      await mapWithConcurrency(
        characters,
        importConcurrency,
        async (character) =>
          this.importCharacter(
            character,
            connection.accessToken,
            professionIdByKey
          )
      );

    return {
      totalCharacters:
        characters.length,
      importedCharacters:
        outcomes.filter(
          (outcome) => outcome.imported
        ).length,
      failedCharacters:
        outcomes
          .map(
            (outcome) =>
              outcome.failure
          )
          .filter(
            (
              failure
            ): failure is BattleNetImportFailure =>
              failure !== null
          )
    };
  }

  private async importCharacter(
    character: ImportableBattleNetCharacter,
    accessToken: string,
    professionIdByKey: Map<string, string>
  ): Promise<ImportOutcome> {
    try {
      const professionData =
        await this.client
          .getCharacterProfessions(
            accessToken,
            character.realmSlug,
            character.name
          );

      const professionAssignments =
        createBattleNetProfessionAssignments(
          professionData,
          professionIdByKey
        );

      await this.characterRepository
        .upsertFromBattleNet({
          ...character,
          region:
            env.BATTLENET_REGION,
          professions:
            professionAssignments
        });

      return {
        imported: true,
        failure: null
      };
    }
    catch (error) {
      if (
        error instanceof AppError &&
        error.statusCode === 401
      ) {
        throw error;
      }

      return {
        imported: false,
        failure: {
          name:
            character.name,
          realm:
            character.realm,
          error:
            error instanceof Error
              ? error.message
              : "Unbekannter Importfehler"
        }
      };
    }
  }

  private async createProfessionIdMap():
    Promise<Map<string, string>> {
    const professions =
      await this.professionRepository.findAll();

    return new Map(
      professions.map((profession) => [
        profession.key,
        profession.id
      ])
    );
  }

  private async getUsableConnection() {
    const connection =
      await this.repository.findConnection();

    if (
      !connection ||
      !this.isTokenUsable(
        connection.expiresAt
      )
    ) {
      throw new AppError(
        401,
        "Bitte Profession Tracker zuerst mit Battle.net verbinden."
      );
    }

    return connection;
  }

  private isTokenUsable(
    expiresAt: Date
  ): boolean {
    return (
      expiresAt.getTime() -
        tokenExpiryBufferMilliseconds >
      Date.now()
    );
  }
}