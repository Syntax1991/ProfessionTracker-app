import type {
  RequestHandler
} from "express";
import { BattleNetService } from "./battlenet.service.js";

export class BattleNetController {
  constructor(
    private readonly service:
      BattleNetService
  ) {}

  getStatus: RequestHandler = (
    _request,
    response
  ) => {
    response.json(
      this.service.getStatus()
    );
  };
}