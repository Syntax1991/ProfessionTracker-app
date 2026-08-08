import { AppError } from "../../../shared/errors/AppError.js";
import {
  createNodeMapKey,
  getActiveExpansion,
  getSyncDate
} from "./addon-import.persistence-utils.js";
import type {
  AddonImportTransaction,
  AddonNodeIdMap,
  CharacterPersistenceResult,
  ProfessionIdMap
} from "./addon-import.persistence.types.js";
import type {
  AddonCharacter,
  AddonProfession,
  AddonSnapshot
} from "./addon-import.types.js";

export class AddonCharacterPersistence {
  async persist(
    transaction:
      AddonImportTransaction,
    snapshot:
      AddonSnapshot,
    professionIds:
      ProfessionIdMap,
    nodeIds:
      AddonNodeIdMap
  ): Promise<CharacterPersistenceResult> {
    const result:
      CharacterPersistenceResult = {
        characters: 0,
        professionAssignments: 0,
        progressEntries: 0
      };

    for (
      const character of
      snapshot.characters
    ) {
      await this.persistCharacter(
        transaction,
        character,
        professionIds,
        nodeIds,
        result
      );

      result.characters += 1;
    }

    return result;
  }

  private async persistCharacter(
    transaction:
      AddonImportTransaction,
    character:
      AddonCharacter,
    professionIds:
      ProfessionIdMap,
    nodeIds:
      AddonNodeIdMap,
    result:
      CharacterPersistenceResult
  ): Promise<void> {
    const syncDate =
      getSyncDate(
        character.lastUpdatedAt
      );

    const storedCharacter =
      await transaction
        .character
        .upsert({
          where: {
            name_realm_region: {
              name:
                character.name,
              realm:
                character.realm,
              region:
                character.region
            }
          },
          create: {
            name:
              character.name,
            realm:
              character.realm,
            region:
              character.region,
            className:
              character.className,
            level:
              character.level,
            source:
              "ADDON",
            lastSyncedAt:
              syncDate
          },
          update: {
            className:
              character.className,
            level:
              character.level,
            lastSyncedAt:
              syncDate
          }
        });

    for (
      const profession of
      character.professions
    ) {
      await this.persistProfession(
        transaction,
        storedCharacter.id,
        profession,
        professionIds,
        nodeIds,
        syncDate,
        result
      );

      result.professionAssignments +=
        1;
    }
  }

  private async persistProfession(
    transaction:
      AddonImportTransaction,
    characterId: string,
    profession:
      AddonProfession,
    professionIds:
      ProfessionIdMap,
    nodeIds:
      AddonNodeIdMap,
    syncDate: Date,
    result:
      CharacterPersistenceResult
  ): Promise<void> {
    const professionKey =
      profession.professionKey;

    if (!professionKey) {
      throw new AppError(
        400,
        `Beruf "${profession.name}" konnte nicht zugeordnet werden.`
      );
    }

    const professionId =
      professionIds.get(
        professionKey
      );

    if (!professionId) {
      throw new AppError(
        400,
        `Beruf "${professionKey}" fehlt in der Datenbank.`
      );
    }

    const activeExpansion =
      getActiveExpansion(
        profession
      );

    const assignment =
      await transaction
        .characterProfession
        .upsert({
          where: {
            characterId_professionId: {
              characterId,
              professionId
            }
          },
          create: {
            characterId,
            professionId,
            skill:
              profession.skillLevel,
            knowledgePoints:
              activeExpansion
                ?.investedKnowledge ??
              0,
            specializationSummary:
              activeExpansion
                ?.displayName ??
              null
          },
          update: {
            skill:
              profession.skillLevel,
            knowledgePoints:
              activeExpansion
                ?.investedKnowledge ??
              0,
            specializationSummary:
              activeExpansion
                ?.displayName ??
              null
          }
        });

    await transaction
      .characterProfessionNodeProgress
      .deleteMany({
        where: {
          characterProfessionId:
            assignment.id,
          source:
            "ADDON"
        }
      });

    for (
      const expansion of
      profession.expansions
    ) {
      for (
        const progress of
        expansion.progress
      ) {
        const nodeId =
          nodeIds.get(
            createNodeMapKey(
              expansion.skillLineId,
              progress.externalTreeId,
              progress.externalNodeId
            )
          );

        if (!nodeId) {
          throw new AppError(
            400,
            `Spezialisierungsknoten ${progress.externalNodeId} für ${profession.name} fehlt im Katalog.`
          );
        }

        await transaction
          .characterProfessionNodeProgress
          .upsert({
            where: {
              characterProfessionId_nodeId: {
                characterProfessionId:
                  assignment.id,
                nodeId
              }
            },
            create: {
              characterProfessionId:
                assignment.id,
              nodeId,
              rank:
                progress.rank,
              source:
                "ADDON",
              lastSyncedAt:
                syncDate
            },
            update: {
              rank:
                progress.rank,
              source:
                "ADDON",
              lastSyncedAt:
                syncDate
            }
          });

        result.progressEntries +=
          1;
      }
    }
  }
}