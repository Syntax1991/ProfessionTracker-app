import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { lootCatalog } from "../../shared/catalog/lootCatalog.js";
import { LootDroptimizerRepository } from "./droptimizer.repository.js";
import { RaidbotsClient } from "./raidbots.client.js";
import type {
  DroptimizerUpgrade,
  RaiderLinkGuard,
  RaidbotsProfilesetResult
} from "./droptimizer.types.js";

export class LootDroptimizerService {
  constructor(
    private readonly repository:
      LootDroptimizerRepository,

    private readonly raidbots:
      RaidbotsClient,

    private readonly raiderLink:
      RaiderLinkGuard
  ) {}

  async getMyReport(token: string) {
    const member =
      await this.requireLinkedMember(
        token
      );

    const report =
      await this.repository.findByMember(
        member.id
      );

    if (!report) {
      return null;
    }

    return this.toReportView(report);
  }

  async setMyReport(
    token: string,
    reportUrl: string
  ) {
    const member =
      await this.requireLinkedMember(
        token
      );

    const reportId =
      this.raidbots.extractReportId(
        reportUrl
      );

    const data =
      await this.raidbots.fetchReport(
        reportId
      );

    if (
      data.simbot?.simType !==
      "droptimizer"
    ) {
      throw new AppError(
        400,
        "Das ist kein Droptimizer-Report."
      );
    }

    const baselineDps =
      data.sim.players[0]
        ?.collected_data.dps.mean ?? 0;

    const upgrades =
      this.computeUpgrades(
        data.sim.profilesets.results,
        baselineDps
      );

    const report =
      await this.repository.upsertReport(
        member.id,
        {
          reportId,
          reportUrl,
          publicTitle:
            data.simbot.publicTitle,
          charClass:
            data.simbot.charClass,
          spec: data.simbot.spec,
          baselineDps,
          upgradesJson:
            JSON.stringify(upgrades)
        }
      );

    return this.toReportView(report);
  }

  async clearMyReport(token: string) {
    const member =
      await this.requireLinkedMember(
        token
      );

    await this.repository.deleteByMember(
      member.id
    );
  }

  private computeUpgrades(
    results: RaidbotsProfilesetResult[],
    baselineDps: number
  ): DroptimizerUpgrade[] {
    const bestByItemId = new Map<
      number,
      {
        result: RaidbotsProfilesetResult;
        itemLevel: number;
      }
    >();

    for (const result of results) {
      const parts =
        result.name.split("/");

      const itemId = Number(parts[3]);
      const itemLevel = Number(
        parts[4]
      );

      if (!Number.isFinite(itemId)) {
        continue;
      }

      const existing =
        bestByItemId.get(itemId);

      if (
        !existing ||
        result.mean >
          existing.result.mean
      ) {
        bestByItemId.set(itemId, {
          result,
          itemLevel: Number.isFinite(
            itemLevel
          )
            ? itemLevel
            : 0
        });
      }
    }

    const upgrades: DroptimizerUpgrade[] =
      [];

    for (const [
      itemId,
      entry
    ] of bestByItemId) {
      const catalogItem =
        this.findCatalogItem(itemId);

      if (!catalogItem) {
        continue;
      }

      const dpsGain =
        entry.result.mean -
        baselineDps;

      const dpsGainPct =
        baselineDps > 0
          ? (dpsGain / baselineDps) *
            100
          : 0;

      upgrades.push({
        itemId,
        name: catalogItem.name,
        slot: catalogItem.slot,
        bossName:
          catalogItem.bossName,
        itemLevel: entry.itemLevel,
        dps: entry.result.mean,
        dpsGain,
        dpsGainPct
      });
    }

    upgrades.sort(
      (a, b) => b.dpsGain - a.dpsGain
    );

    return upgrades;
  }

  private findCatalogItem(
    itemId: number
  ) {
    for (const raid of lootCatalog) {
      const item = raid.items.find(
        (candidate) =>
          candidate.itemId === itemId
      );

      if (item) {
        return item;
      }
    }

    return null;
  }

  private toReportView(report: {
    id: string;
    memberId: string;
    reportId: string;
    reportUrl: string;
    publicTitle: string;
    charClass: string;
    spec: string;
    baselineDps: number;
    upgradesJson: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: report.id,
      memberId: report.memberId,
      reportId: report.reportId,
      reportUrl: report.reportUrl,
      publicTitle: report.publicTitle,
      charClass: report.charClass,
      spec: report.spec,
      baselineDps: report.baselineDps,
      upgrades: JSON.parse(
        report.upgradesJson
      ) as DroptimizerUpgrade[],
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    };
  }

  private async requireLinkedMember(
    token: string
  ) {
    const member =
      await this.raiderLink.getLinkedMember(
        token
      );

    if (!member) {
      throw new AppError(
        403,
        "Bitte zuerst dein Battle.net-Konto unter „My Raider Login“ mit deinem Gildenmitglied verknüpfen."
      );
    }

    return member;
  }
}
