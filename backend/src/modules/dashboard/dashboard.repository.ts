import { prisma } from "../../infrastructure/database/prismaClient.js";

export class DashboardRepository {
  countCharacters() {
    return prisma.character.count();
  }

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

  countProfessionAssignments() {
    return prisma
      .characterProfession
      .count();
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
}