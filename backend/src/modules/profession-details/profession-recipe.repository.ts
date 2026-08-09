import { prisma } from "../../infrastructure/database/prismaClient.js";

export class ProfessionRecipeRepository {
  findByProfessionId(
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

        recipes: {
          orderBy: [
            {
              name: "asc"
            },
            {
              gameRecipeId: "asc"
            }
          ],

          select: {
            id: true,
            gameRecipeId: true,
            name: true,
            expansion: true,
            categoryId: true,
            baseDifficulty: true,

            capabilities: {
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
                    sortOrder: true
                  }
                }
              }
            },

            characters: {
              where: {
                learned: true
              },

              select: {
                source: true,
                lastSyncedAt: true,

                characterProfession: {
                  select: {
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