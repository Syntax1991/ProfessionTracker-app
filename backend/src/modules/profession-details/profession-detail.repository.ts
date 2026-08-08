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

  findById(
    professionId: string
  ) {
    return prisma.profession.findUnique({
      where: {
        id: professionId
      },

      select: {
        id: true,
        key: true,
        name: true,
        category: true,

        specializationTrees: {
          select: {
            id: true
          }
        },

        assignments: {
          select: {
            id: true,
            skill: true,
            knowledgePoints: true,

            character: {
              select: {
                id: true,
                name: true,
                realm: true,
                className: true,
                level: true
              }
            },

            nodeProgress: {
              where: {
                rank: {
                  gt: 0
                }
              },

              select: {
                rank: true,
                knowledgeRank: true,
                unlockRank: true,
                source: true,

                node: {
                  select: {
                    name: true,
                    maxRank: true,
                    knowledgeMaxRank: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }
}