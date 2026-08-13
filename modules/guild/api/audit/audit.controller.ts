import type {
  RequestHandler
} from "express";
import { GuildAuditService } from "./audit.service.js";

export class GuildAuditController {
  constructor(
    private readonly service:
      GuildAuditService
  ) {}

  refreshAll: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.refreshAll()
    );
  };
}
