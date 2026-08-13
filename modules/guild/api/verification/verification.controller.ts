import type {
  RequestHandler
} from "express";
import { GuildVerificationService } from "./verification.service.js";
import { guildVerificationInputSchema } from "./verification.validation.js";

export class GuildVerificationController {
  constructor(
    private readonly service:
      GuildVerificationService
  ) {}

  listCandidates: RequestHandler = async (
    _request,
    response
  ) => {
    const items =
      await this.service.listCandidates();

    response.json({
      items
    });
  };

  getStatus: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.getStatus()
    );
  };

  verify: RequestHandler = async (
    request,
    response
  ) => {
    const input =
      guildVerificationInputSchema.parse(
        request.body
      );

    response.json(
      await this.service.verify(
        input
      )
    );
  };

  clear: RequestHandler = async (
    _request,
    response
  ) => {
    await this.service.clear();

    response.status(204).send();
  };
}
