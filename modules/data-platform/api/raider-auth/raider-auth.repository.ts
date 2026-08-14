import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class RaiderAuthRepository {
  findAccountByBattleTag(
    battleTag: string
  ) {
    return prisma.raiderAccount.findUnique({
      where: {
        battleTag
      }
    });
  }

  createAccount(
    battleTag: string | null
  ) {
    return prisma.raiderAccount.create({
      data: {
        battleTag
      }
    });
  }

  updateAccountToken(
    accountId: string,
    input: {
      accessToken: string;
      tokenType: string;
      scope: string | null;
      tokenExpiresAt: Date;
    }
  ) {
    return prisma.raiderAccount.update({
      where: {
        id: accountId
      },
      data: {
        accessToken:
          input.accessToken,
        tokenType:
          input.tokenType,
        scope: input.scope,
        tokenExpiresAt:
          input.tokenExpiresAt
      }
    });
  }

  createSession(input: {
    token: string;
    raiderAccountId: string;
    charactersJson: string;
    expiresAt: Date;
  }) {
    return prisma.raiderSession.create({
      data: {
        id: input.token,
        raiderAccountId:
          input.raiderAccountId,
        charactersJson:
          input.charactersJson,
        expiresAt: input.expiresAt
      }
    });
  }

  findValidSession(
    token: string
  ) {
    return prisma.raiderSession.findFirst({
      where: {
        id: token,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        account: true
      }
    });
  }

  deleteSession(
    token: string
  ) {
    return prisma.raiderSession.deleteMany({
      where: {
        id: token
      }
    });
  }
}
