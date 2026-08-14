import type {
  RequestHandler
} from "express";
import { requireBearerToken } from "../../../../apps/api/src/shared/http/bearerToken.js";
import { droptimizerReportInputSchema } from "./droptimizer.validation.js";
import { LootDroptimizerService } from "./droptimizer.service.js";

export class LootDroptimizerController {
  constructor(
    private readonly service:
      LootDroptimizerService
  ) {}

  getMyReport: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const report =
      await this.service.getMyReport(
        token
      );

    response.json(report);
  };

  setMyReport: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const input =
      droptimizerReportInputSchema.parse(
        request.body
      );

    response.json(
      await this.service.setMyReport(
        token,
        input.reportUrl
      )
    );
  };

  clearMyReport: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    await this.service.clearMyReport(
      token
    );

    response.status(204).send();
  };
}
