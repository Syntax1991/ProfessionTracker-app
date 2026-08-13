import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

const verificationId = "primary";

export type GuildVerificationRecordInput = {
  guildName: string;
  realmName: string;
  realmSlug: string;
  region: string;
  faction: string | null;
  memberCount: number | null;
  verifiedCharacter: string;
  verifiedRealmSlug: string;
  verifiedRank: number;
};

export class GuildVerificationRepository {
  find() {
    return prisma.guildVerification.findUnique({
      where: {
        id: verificationId
      }
    });
  }

  save(
    input: GuildVerificationRecordInput
  ) {
    return prisma.guildVerification.upsert({
      where: {
        id: verificationId
      },
      create: {
        id: verificationId,
        ...input
      },
      update: {
        ...input
      }
    });
  }

  clear() {
    return prisma.guildVerification.deleteMany({
      where: {
        id: verificationId
      }
    });
  }
}
