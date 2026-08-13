import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class DashboardRepository {
  countCraftingReadyCharacters(
    minimumLevel: number
  ) {
    return prisma.character.count({
      where: {
        level: {
          gte: minimumLevel
        }
      }
    });
  }

  findProfessionCoverage() {
    return prisma.profession.findMany({
      include: {
        _count: {
          select: {
            assignments: true
          }
        }
      },
      orderBy: {
        order: "asc"
      }
    });
  }

  findCharacterOverview() {
    return prisma.character.findMany({
      select: {
        id: true,
        name: true,
        realm: true,
        region: true,
        className: true,
        level: true,
        source: true,
        lastSyncedAt: true,
        professions: {
          select: {
            id: true,
            skill: true,
            knowledgePoints: true,
            profession: {
              select: {
                id: true,
                key: true,
                name: true,
                category: true
              }
            }
          }
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
}
