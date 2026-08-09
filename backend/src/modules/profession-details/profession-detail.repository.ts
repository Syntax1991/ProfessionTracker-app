import { prisma } from "../../infrastructure/database/prismaClient.js";
import {
  TRACKED_PROFESSION_EXPANSION
} from "./profession-expansion.constants.js";

export class ProfessionDetailRepository {
  findOverview() {
    return prisma.profession.findMany({
      include: {
        capabilities: {
          where: {
            expansion:
              TRACKED_PROFESSION_EXPANSION
          },

          select: {
            id: true
          }
        },

        recipes: {
          where: {
            expansion:
              TRACKED_PROFESSION_EXPANSION
          },

          select: {
            id: true
          }
        },

        assignments: {
          select: {
            id: true,

            nodeProgress: {
              where: {
                node: {
                  tree: {
                    expansion:
                      TRACKED_PROFESSION_EXPANSION
                  }
                }
              },

              select: {
                rank: true,
                knowledgeRank: true
              }
            },

            recipes: {
              where: {
                learned: true,

                recipe: {
                  expansion:
                    TRACKED_PROFESSION_EXPANSION
                }
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
          where: {
            expansion:
              TRACKED_PROFESSION_EXPANSION
          },

          select: {
            id: true
          }
        },

        capabilities: {
          where: {
            expansion:
              TRACKED_PROFESSION_EXPANSION
          },

          select: {
            id: true
          }
        },

        recipes: {
          where: {
            expansion:
              TRACKED_PROFESSION_EXPANSION
          },

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
                },

                node: {
                  tree: {
                    expansion:
                      TRACKED_PROFESSION_EXPANSION
                  }
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
                learned: true,

                recipe: {
                  expansion:
                    TRACKED_PROFESSION_EXPANSION
                }
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
                    categoryId: true,

                    capabilities: {
                      where: {
                        capability: {
                          expansion:
                            TRACKED_PROFESSION_EXPANSION
                        }
                      },

                      select: {
                        isPrimary: true,

                        capability: {
                          select: {
                            id: true,
                            key: true,
                            name: true,
                            type: true,
                            slotKey: true,
                            description: true,
                            expansion: true,
                            sortOrder: true
                          }
                        }
                      }
                    }
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