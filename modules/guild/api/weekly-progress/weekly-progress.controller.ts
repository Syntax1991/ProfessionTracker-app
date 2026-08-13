import type {
  RequestHandler
} from "express";
import { GuildWeeklyProgressService } from "./weekly-progress.service.js";

export class GuildWeeklyProgressController {
  constructor(
    private readonly service:
      GuildWeeklyProgressService
  ) {}

  getSummary: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.getSummary()
    );
  };
}
