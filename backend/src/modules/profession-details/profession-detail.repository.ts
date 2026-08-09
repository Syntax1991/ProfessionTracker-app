import { prisma } from "../../infrastructure/database/prismaClient.js";

export class ProfessionDetailRepository {
  findOverview() {
    return prisma.profession.findMany({
      include: {
        recipes: {
          select: {
            id: true
          }
        },

        assignments: {
          select: {
            id: true,

            nodeProgress: {
              select: {
                rank: true
              }
            },

            recipes: {
              where: {
                learned: true
              },

              select: {
                id: true
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

        recipes: {
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
            },

            recipes: {
              where: {
                learned: true
              },

              select: {
                source: true,
                lastSyncedAt: true,

                recipe: {
                  select: {
                    id: true,
                    gameRecipeId: true,
                    skillLineId: true,
                    expansion: true,
                    name: true,
                    categoryId: true
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