import { prisma } from "../../../infrastructure/database/prismaClient.js";
import type { BattleNetConnectionInput } from "./battlenet.types.js";

const connectionId = "primary";

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

  findConnection() {
    return prisma.battleNetConnection.findUnique({
      where: {
        id: connectionId
      }
    });
  }

  saveConnection(
    input: BattleNetConnectionInput
  ) {
    return prisma.battleNetConnection.upsert({
      where: {
        id: connectionId
      },
      create: {
        id: connectionId,
        battleTag: input.battleTag,
        accessToken: input.accessToken,
        tokenType: input.tokenType,
        scope: input.scope,
        expiresAt: input.expiresAt
      },
      update: {
        battleTag: input.battleTag,
        accessToken: input.accessToken,
        tokenType: input.tokenType,
        scope: input.scope,
        expiresAt: input.expiresAt
      }
    });
  }

  disconnect() {
    return prisma.battleNetConnection.deleteMany({
      where: {
        id: connectionId
      }
    });
  }
}