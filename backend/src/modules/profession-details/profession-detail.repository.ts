import { prisma } from "../../infrastructure/database/prismaClient.js";

export class ProfessionDetailRepository {
  findOverview() {
    return prisma.profession.findMany({
      include: {
        assignments: {
          select: {
            id: true,
            nodeProgress: {
              select: {
                rank: true
              }
            }
          }
        }
      },
      orderBy: {
        order: "asc"
      }
    });
  }

  findById(professionId: string) {
    return prisma.profession.findUnique({
      where: {
        id: professionId
      },
      include: {
        specializationTrees: {
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
        },
        assignments: {
          include: {
            character: true,
            nodeProgress: {
              include: {
                node: true
              }
            }
          }
        }
      }
    });
  }
}