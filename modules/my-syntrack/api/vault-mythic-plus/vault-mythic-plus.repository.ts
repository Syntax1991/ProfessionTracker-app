import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { MythicPlusRunInput } from "./vault-mythic-plus.types.js";

export class VaultMythicPlusRepository {
  findCharacterById(characterId: string) {
    return prisma.character.findUnique({
      where: {
        id: characterId
      },
      select: {
        id: true
      }
    });
  }

  findCharacters(periodKey: string) {
    return prisma.character.findMany({
      select: {
        id: true,
        name: true,
        realm: true,
        region: true,
        className: true,
        level: true,
        weeklyMythicRuns: {
          where: {
            periodKey
          },
          orderBy: [
            {
              keyLevel: "desc"
            },
            {
              completedAt: "desc"
            }
          ]
        }
      },
      orderBy: [
        {
          level: "desc"
        },
        {
          name: "asc"
        }
      ]
    });
  }

  createRun(
    characterId: string,
    periodKey: string,
    input: MythicPlusRunInput
  ) {
    return prisma.weeklyMythicPlusRun.create({
      data: {
        characterId,
        periodKey,
        dungeonName:
          input.dungeonName?.trim() ||
          null,
        keyLevel: input.keyLevel
      }
    });
  }

  findRunById(runId: string) {
    return prisma.weeklyMythicPlusRun.findUnique({
      where: {
        id: runId
      }
    });
  }

  deleteRun(runId: string) {
    return prisma.weeklyMythicPlusRun.delete({
      where: {
        id: runId
      }
    });
  }
}
