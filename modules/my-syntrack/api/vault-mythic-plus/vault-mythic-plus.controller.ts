import type { RequestHandler } from "express";
import { VaultMythicPlusService } from "./vault-mythic-plus.service.js";
import {
  mythicPlusRunInputSchema,
  vaultCharacterIdSchema,
  vaultRunIdSchema
} from "./vault-mythic-plus.validation.js";

export class VaultMythicPlusController {
  constructor(
    private readonly service:
      VaultMythicPlusService
  ) {}

  getOverview: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.getOverview()
    );
  };

  addRun: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      vaultCharacterIdSchema.parse(
        request.params.characterId
      );
    const input =
      mythicPlusRunInputSchema.parse(
        request.body
      );

    response
      .status(201)
      .json(
        await this.service.addRun(
          characterId,
          input
        )
      );
  };

  deleteRun: RequestHandler = async (
    request,
    response
  ) => {
    const runId =
      vaultRunIdSchema.parse(
        request.params.runId
      );

    response.json(
      await this.service.deleteRun(runId)
    );
  };
}
