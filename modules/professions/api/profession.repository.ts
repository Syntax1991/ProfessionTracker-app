import { prisma } from "../../../apps/api/src/infrastructure/database/prismaClient.js";

export class ProfessionRepository {
  findAll() {
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

  countByIds(
    professionIds: string[]
  ) {
    return prisma.profession.count({
      where: {
        id: {
          in: professionIds
        }
      }
    });
  }
}