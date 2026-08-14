import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { RaidbotsReportData } from "./droptimizer.types.js";

const reportUrlPattern =
  /raidbots\.com\/(?:simbot\/report|reports)\/([A-Za-z0-9]+)/;

export class RaidbotsClient {
  extractReportId(
    reportUrl: string
  ): string {
    const match =
      reportUrlPattern.exec(reportUrl);

    if (!match?.[1]) {
      throw new AppError(
        400,
        "Das ist keine gültige Raidbots-Report-URL."
      );
    }

    return match[1];
  }

  async fetchReport(
    reportId: string
  ): Promise<RaidbotsReportData> {
    const response = await fetch(
      `https://www.raidbots.com/reports/${reportId}/data.json`
    );

    if (!response.ok) {
      throw new AppError(
        502,
        "Der Raidbots-Report konnte nicht geladen werden."
      );
    }

    try {
      return (await response.json()) as RaidbotsReportData;
    }
    catch {
      throw new AppError(
        502,
        "Der Raidbots-Report konnte nicht gelesen werden."
      );
    }
  }
}
