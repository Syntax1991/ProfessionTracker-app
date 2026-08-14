import type {
  RequestHandler
} from "express";
import { requireBearerToken } from "../../../../apps/api/src/shared/http/bearerToken.js";
import { GuildAuditService } from "./audit.service.js";

export class GuildAuditController {
  constructor(
    private readonly service:
      GuildAuditService
  ) {}

  refreshAll: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    response.json(
      await this.service.refreshAll(
        token
      )
    );
  };

  listGearSlots: RequestHandler = async (
    _request,
    response
  ) => {
    const items =
      await this.service.listGearSlots();

    response.json({
      items,
      total: items.length
    });
  };
}
