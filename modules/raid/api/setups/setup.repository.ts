import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import { resolveRaidWeek } from "../../shared/catalog/raidWeek.js";

const DEFAULT_SETUP_KEY = "main";

const setupInclude = {
  members: true
} as const;

export class RaidSetupRepository {
  findEventById(eventId: string) {
    return prisma.raidEvent.findUnique({
      where: { id: eventId }
    });
  }

  findMemberById(memberId: string) {
    return prisma.guildMember.findUnique({
      where: { id: memberId }
    });
  }

  findSetupById(setupId: string) {
    return prisma.raidSetup.findUnique({
      where: { id: setupId },
      include: setupInclude
    });
  }

  /**
   * Resolves the Phase-1 default ("main") Setup for an event, creating
   * the RaidWeek/RaidPlan/RaidSetup chain on first use. The RaidSetup
   * upsert is keyed on the real @@unique([raidEventId, key]) DB
   * constraint, so two concurrent requests for the same event can
   * never create two "main" setups — the constraint itself, not this
   * code, is what guarantees that.
   */
  async getOrCreateForEvent(eventId: string) {
    const event = await this.findEventById(eventId);

    if (!event) {
      return null;
    }

    const { startsAt, endsAt } = resolveRaidWeek(
      event.scheduledAt
    );

    const week = await prisma.raidWeek.upsert({
      where: { startsAt },
      create: { startsAt, endsAt },
      update: {}
    });

    let plan = await prisma.raidPlan.findFirst({
      where: { raidWeekId: week.id }
    });

    if (!plan) {
      plan = await prisma.raidPlan.create({
        data: { raidWeekId: week.id }
      });
    }

    return prisma.raidSetup.upsert({
      where: {
        raidEventId_key: {
          raidEventId: eventId,
          key: DEFAULT_SETUP_KEY
        }
      },
      create: {
        raidPlanId: plan.id,
        raidEventId: eventId,
        key: DEFAULT_SETUP_KEY
      },
      update: {},
      include: setupInclude
    });
  }

  addMembers(setupId: string, memberIds: string[]) {
    return prisma.$transaction(
      memberIds.map((memberId) =>
        prisma.raidSetupMember.upsert({
          where: {
            setupId_memberId: {
              setupId,
              memberId
            }
          },
          create: { setupId, memberId },
          update: {}
        })
      )
    );
  }

  removeMember(setupId: string, memberId: string) {
    return prisma.raidSetupMember.deleteMany({
      where: { setupId, memberId }
    });
  }

  async isSetupMember(
    setupId: string,
    memberId: string
  ): Promise<boolean> {
    const membership = await prisma.raidSetupMember.findUnique({
      where: {
        setupId_memberId: { setupId, memberId }
      }
    });

    return membership !== null;
  }
}
