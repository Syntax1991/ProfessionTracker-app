import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import {
  TRACKED_PROFESSION_DATA_SOURCE,
  TRACKED_PROFESSION_EXPANSION,
  TRACKED_PROFESSION_EXPANSION_LABEL
} from "./profession-expansion.constants.js";

function createTrackedAssignmentWhere() {
  /*
   * A newly learned Midnight profession may not have recipes or invested
   * specialization points yet. Until profession skill metrics are stored
   * per expansion, the imported expansion display name is the fallback
   * evidence that the character actually owns the Midnight profession.
   */
  return {
    OR: [
      {
        specializationSummary: {
          contains:
            TRACKED_PROFESSION_EXPANSION_LABEL
        }
      },
      {
        nodeProgress: {
          some: {
            source:
              TRACKED_PROFESSION_DATA_SOURCE,

            node: {
              tree: {
                expansion:
                  TRACKED_PROFESSION_EXPANSION
              }
            }
          }
        }
      },
      {
        recipes: {
          some: {
            learned: true,

            recipe: {
              expansion:
                TRACKED_PROFESSION_EXPANSION
            }
          }
        }
      }
    ]
  };
}

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
            id: true,
            source: true,
            lastSyncedAt: true
          }
        },

        assignments: {
          where:
            createTrackedAssignmentWhere(),

          select: {
            id: true,

            nodeProgress: {
              where: {
                source:
                  TRACKED_PROFESSION_DATA_SOURCE,

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
          where:
            createTrackedAssignmentWhere(),

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
                source:
                  TRACKED_PROFESSION_DATA_SOURCE,

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