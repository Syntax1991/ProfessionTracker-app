import { prisma } from "../../infrastructure/database/prismaClient.js";
import type { SpecializationProgressInput } from "./specialization.types.js";

export class SpecializationRepository {
  findCharacter(characterId: string) {
    return prisma.character.findUnique({
      where: {
        id: characterId
      },
      include: {
        professions: {
          include: {
            profession: true,
            nodeProgress: true
          }
        }
      }
    });
  }

  findCharacterProfession(
    characterProfessionId: string
  ) {
    return prisma.characterProfession.findUnique({
      where: {
        id: characterProfessionId
      },
      include: {
        character: true,
        profession: true
      }
    });
  }

  findTreesByProfessionIds(
    professionIds: string[]
  ) {
    return prisma.professionSpecializationTree.findMany({
      where: {
        professionId: {
          in: professionIds
        }
      },
      include: {
        nodes: {
          orderBy: [
            {
              sortOrder: "asc"
            },
            {
              name: "asc"
            }
          ]
        }
      },
      orderBy: [
        {
          sortOrder: "asc"
        },
        {
          name: "asc"
        }
      ]
    });
  }

  findNodesByIds(nodeIds: string[]) {
    return prisma.professionSpecializationNode.findMany({
      where: {
        id: {
          in: nodeIds
        }
      },
      include: {
        tree: true
      }
    });
  }

  replaceProgress(
    characterProfessionId: string,
    progress: SpecializationProgressInput[],
    source: string
  ) {
    return prisma.$transaction(
      async (transaction) => {
        await transaction.characterProfessionNodeProgress.deleteMany({
          where: {
            characterProfessionId
          }
        });

        const activeProgress =
          progress.filter(
            (entry) =>
              entry.rank > 0
          );

        if (activeProgress.length > 0) {
          await transaction.characterProfessionNodeProgress.createMany({
            data: activeProgress.map(
              (entry) => ({
                characterProfessionId,
                nodeId: entry.nodeId,
                rank: entry.rank,
                source,
                lastSyncedAt:
                  source === "ADDON"
                    ? new Date()
                    : null
              })
            )
          });
        }
      }
    );
  }
}