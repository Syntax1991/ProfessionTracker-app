import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type { GuildMemberAuditStats } from "./audit.types.js";

export class GuildAuditRepository {
  findAllMembers() {
    return prisma.guildMember.findMany();
  }

  updateAudit(
    memberId: string,
    stats: GuildMemberAuditStats
  ) {
    return prisma.guildMember.update({
      where: {
        id: memberId
      },
      data: {
        averageItemLevel:
          stats.averageItemLevel,
        missingEnchantSlots:
          stats.missingEnchantSlots,
        totalSocketCount:
          stats.totalSocketCount,
        filledSocketCount:
          stats.filledSocketCount,
        auditedAt: new Date()
      }
    });
  }
}
