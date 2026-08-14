import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type {
  GuildMemberAuditStats,
  GuildMemberGearSlotStats
} from "./audit.types.js";

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

  async replaceGearSlots(
    memberId: string,
    slots: GuildMemberGearSlotStats[]
  ) {
    await prisma.guildMemberGearSlot.deleteMany({
      where: {
        memberId
      }
    });

    if (slots.length === 0) {
      return;
    }

    await prisma.guildMemberGearSlot.createMany({
      data: slots.map(
        (slot) => ({
          memberId,
          ...slot
        })
      )
    });
  }

  findAllGearSlots() {
    return prisma.guildMemberGearSlot.findMany();
  }
}
