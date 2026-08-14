import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class RaiderLinkRepository {
  findMemberByLinkedAccount(
    raiderAccountId: string
  ) {
    return prisma.guildMember.findUnique({
      where: {
        linkedRaiderAccountId:
          raiderAccountId
      }
    });
  }

  findMemberById(
    memberId: string
  ) {
    return prisma.guildMember.findUnique({
      where: {
        id: memberId
      }
    });
  }

  linkMember(
    memberId: string,
    raiderAccountId: string
  ) {
    return prisma.guildMember.update({
      where: {
        id: memberId
      },
      data: {
        linkedRaiderAccountId:
          raiderAccountId
      }
    });
  }
}
