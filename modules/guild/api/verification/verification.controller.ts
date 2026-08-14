import type {
  RequestHandler
} from "express";
import { requireBearerToken } from "../../../../apps/api/src/shared/http/bearerToken.js";
import { GuildVerificationService } from "./verification.service.js";
import {
  guildVerificationInputSchema,
  guildVerificationLookupInputSchema
} from "./verification.validation.js";

export class GuildVerificationController {
  constructor(
    private readonly service:
      GuildVerificationService
  ) {}

  listCandidates: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const items =
      await this.service.listCandidates(
        token
      );

    response.json({
      items
    });
  };

  lookupGuild: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const input =
      guildVerificationLookupInputSchema.parse(
        request.body
      );

    response.json(
      await this.service.lookupGuild(
        token,
        input
      )
    );
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
    const token =
      requireBearerToken(request);

    const input =
      guildVerificationInputSchema.parse(
        request.body
      );

    response.json(
      await this.service.verify(
        token,
        input
      )
    );
  };

  clear: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    await this.service.clear(
      token
    );

    response.status(204).send();
  };
}
