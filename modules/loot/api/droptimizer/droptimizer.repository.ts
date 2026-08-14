import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export class LootDroptimizerRepository {
  findByMember(
    memberId: string
  ) {
    return prisma.lootSimReport.findUnique(
      {
        where: {
          memberId
        }
      }
    );
  }

  upsertReport(
    memberId: string,
    data: {
      reportId: string;
      reportUrl: string;
      publicTitle: string;
      charClass: string;
      spec: string;
      baselineDps: number;
      upgradesJson: string;
    }
  ) {
    return prisma.lootSimReport.upsert(
      {
        where: {
          memberId
        },
        create: {
          memberId,
          ...data
        },
        update: data
      }
    );
  }

  deleteByMember(
    memberId: string
  ) {
    return prisma.lootSimReport.deleteMany(
      {
        where: {
          memberId
        }
      }
    );
  }
}
