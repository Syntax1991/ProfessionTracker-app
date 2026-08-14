import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class LootWishlistRepository {
  findTierPreferences(
    memberId: string
  ) {
    return prisma.lootTierPreference.findMany(
      {
        where: {
          memberId
        }
      }
    );
  }

  findTrinketChoices(
    memberId: string
  ) {
    return prisma.lootTrinketChoice.findMany(
      {
        where: {
          memberId
        },
        orderBy: {
          rank: "asc"
        }
      }
    );
  }

  upsertTierPreference(
    memberId: string,
    tierSlot: string,
    status: string
  ) {
    return prisma.lootTierPreference.upsert(
      {
        where: {
          memberId_tierSlot: {
            memberId,
            tierSlot
          }
        },
        create: {
          memberId,
          tierSlot,
          status
        },
        update: {
          status
        }
      }
    );
  }

  deleteTierPreference(
    memberId: string,
    tierSlot: string
  ) {
    return prisma.lootTierPreference.deleteMany(
      {
        where: {
          memberId,
          tierSlot
        }
      }
    );
  }

  upsertTrinketChoice(
    memberId: string,
    rank: number,
    itemId: number
  ) {
    return prisma.lootTrinketChoice.upsert(
      {
        where: {
          memberId_rank: {
            memberId,
            rank
          }
        },
        create: {
          memberId,
          rank,
          itemId
        },
        update: {
          itemId
        }
      }
    );
  }

  deleteTrinketChoice(
    memberId: string,
    rank: number
  ) {
    return prisma.lootTrinketChoice.deleteMany(
      {
        where: {
          memberId,
          rank
        }
      }
    );
  }

  clearItemFromOtherRanks(
    memberId: string,
    itemId: number,
    exceptRank: number
  ) {
    return prisma.lootTrinketChoice.deleteMany(
      {
        where: {
          memberId,
          itemId,
          rank: {
            not: exceptRank
          }
        }
      }
    );
  }
}
