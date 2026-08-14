import type {
  RequestHandler
} from "express";
import { requireBearerToken } from "../../../../apps/api/src/shared/http/bearerToken.js";
import { GuildRaiderLinkService } from "./raider-link.service.js";
import { raiderLinkMemberIdSchema } from "./raider-link.validation.js";

export class GuildRaiderLinkController {
  constructor(
    private readonly service:
      GuildRaiderLinkService
  ) {}

  resolve: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    response.json(
      await this.service.resolve(
        token
      )
    );
  };

  claim: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const memberId =
      raiderLinkMemberIdSchema.parse(
        request.body.memberId
      );

    response.json(
      await this.service.claim(
        token,
        memberId
      )
    );
  };

  getLinkedMember: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const member =
      await this.service.getLinkedMember(
        token
      );

    response.json({
      member: member ?? null
    });
  };
}
