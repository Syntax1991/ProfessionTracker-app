import type {
  RequestHandler
} from "express";
import { requireBearerToken } from "../../../../../apps/api/src/shared/http/bearerToken.js";
import { BattleNetService } from "./battlenet.service.js";
import { battleNetImportInputSchema } from "./battlenet.validation.js";

export class BattleNetController {
  constructor(
    private readonly service:
      BattleNetService
  ) {}

  listCharacters:
    RequestHandler = async (
      request,
      response
    ) => {
      const token =
        requireBearerToken(request);

      response.json(
        await this.service
          .listCharacters(token)
      );
    };

  importCharacters:
    RequestHandler = async (
      request,
      response
    ) => {
      const token =
        requireBearerToken(request);

      const input =
        battleNetImportInputSchema
          .parse(request.body);

      response.json(
        await this.service
          .importCharacters(
            token,
            input.characterKeys
          )
      );
    };
}
