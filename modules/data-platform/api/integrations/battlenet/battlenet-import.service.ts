import { env } from "../../../../../apps/api/src/config/env.js";
import { mapWithConcurrency } from "../../../../../apps/api/src/shared/async/mapWithConcurrency.js";
import { AppError } from "../../../../../apps/api/src/shared/errors/AppError.js";
import { CharacterRepository } from "../../../../my-syntrack/api/characters/character.repository.js";
import { ProfessionRepository } from "../../../../professions/api/profession.repository.js";
import { BattleNetClient } from "./battlenet.client.js";
import {
  createBattleNetCharacterKey,
  createBattleNetProfessionAssignments,
  normalizeBattleNetCharacters,
  type ImportableBattleNetCharacter
} from "./battlenet-import.mapper.js";
import { BattleNetRepository } from "./battlenet.repository.js";
import type {
  BattleNetCharacterPreviewResult,
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

  async listCharacters():
    Promise<BattleNetCharacterPreviewResult> {
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

    const importedIdentities =
      await this.characterRepository
        .findBattleNetIdentities(
          env.BATTLENET_REGION
        );

    const importedKeys =
      new Set<string>();

    for (
      const identity of
      importedIdentities
    ) {
      if (
        identity.battleNetId &&
        identity.realmSlug
      ) {
        importedKeys.add(
          createBattleNetCharacterKey({
            battleNetId:
              identity.battleNetId,
            realmSlug:
              identity.realmSlug
          })
        );
      }
    }

    const items = characters
      .map((character) => {
        const key =
          createBattleNetCharacterKey(
            character
          );

        return {
          key,
          ...character,
          imported:
            importedKeys.has(key)
        };
      })
      .sort(
        (left, right) =>
          right.level - left.level ||
          left.realm.localeCompare(
            right.realm,
            "de"
          ) ||
          left.name.localeCompare(
            right.name,
            "de"
          )
      );

    return {
      items,
      totalCharacters:
        items.length,
      defaultMinimumLevel:
        env.CRAFTING_MIN_LEVEL
    };
  }

  async importCharacters(
    characterKeys: string[]
  ): Promise<BattleNetImportResult> {
    const connection =
      await this.getUsableConnection();

    const accountProfile =
      await this.client.getAccountProfile(
        connection.accessToken
      );

    const availableCharacters =
      normalizeBattleNetCharacters(
        accountProfile
      );

    const requestedKeys =
      new Set(characterKeys);

    const selectedCharacters =
      availableCharacters.filter(
        (character) =>
          requestedKeys.has(
            createBattleNetCharacterKey(
              character
            )
          )
      );

    if (
      selectedCharacters.length !==
      requestedKeys.size
    ) {
      throw new AppError(
        400,
        "Mindestens ein ausgewählter Charakter ist im Battle.net-Konto nicht mehr verfügbar."
      );
    }

    const professionIdByKey =
      await this.createProfessionIdMap();

    const outcomes =
      await mapWithConcurrency(
        selectedCharacters,
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
        selectedCharacters.length,
      importedCharacters:
        outcomes.filter(
          (outcome) =>
            outcome.imported
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
    character:
      ImportableBattleNetCharacter,
    accessToken: string,
    professionIdByKey:
      Map<string, string>
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
      await this.professionRepository
        .findAll();

    return new Map(
      professions.map(
        (profession) => [
          profession.key,
          profession.id
        ]
      )
    );
  }

  private async getUsableConnection() {
    const connection =
      await this.repository
        .findConnection();

    if (
      !connection ||
      !this.isTokenUsable(
        connection.expiresAt
      )
    ) {
      throw new AppError(
        401,
        "Bitte SynTrack zuerst mit Battle.net verbinden."
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