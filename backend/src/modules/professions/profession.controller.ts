import type {
  RequestHandler
} from "express";
import { ProfessionService } from "./profession.service.js";

export class ProfessionController {
  constructor(
    private readonly service:
      ProfessionService
  ) {}

  list: RequestHandler = async (
    _request,
    response
  ) => {
    response.json({
      items:
        await this.service.list()
    });
  };
}