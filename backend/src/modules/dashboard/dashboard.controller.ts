import type {
  RequestHandler
} from "express";
import { DashboardService } from "./dashboard.service.js";

export class DashboardController {
  constructor(
    private readonly service:
      DashboardService
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