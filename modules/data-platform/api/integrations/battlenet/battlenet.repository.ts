import { prisma } from "../../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class BattleNetRepository {
  async createOAuthState(
    state: string,
    expiresAt: Date
  ) {
    await prisma.battleNetOAuthState.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return prisma.battleNetOAuthState.create({
      data: {
        id: state,
        expiresAt
      }
    });
  }

  async consumeOAuthState(
    state: string
  ): Promise<boolean> {
    const storedState =
      await prisma.battleNetOAuthState.findUnique({
        where: {
          id: state
        }
      });

    if (!storedState) {
      return false;
    }

    await prisma.battleNetOAuthState.deleteMany({
      where: {
        id: state
      }
    });

    return storedState.expiresAt.getTime() >
      Date.now();
  }
}