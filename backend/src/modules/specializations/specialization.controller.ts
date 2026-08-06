import type {
  RequestHandler
} from "express";
import { SpecializationService } from "./specialization.service.js";
import {
  characterSpecializationParamsSchema,
  updateSpecializationInputSchema,
  updateSpecializationParamsSchema
} from "./specialization.validation.js";

export class SpecializationController {
  constructor(
    private readonly service:
      SpecializationService
  ) {}

  getCharacterOverview:
    RequestHandler = async (
      request,
      response
    ) => {
      const params =
        characterSpecializationParamsSchema.parse(
          request.params
        );

      response.json(
        await this.service
          .getCharacterOverview(
            params.characterId
          )
      );
    };

  updateProfessionProgress:
    RequestHandler = async (
      request,
      response
    ) => {
      const params =
        updateSpecializationParamsSchema.parse(
          request.params
        );

      const input =
        updateSpecializationInputSchema.parse(
          request.body
        );

      response.json(
        await this.service
          .updateProfessionProgress(
            params.characterId,
            params.characterProfessionId,
            input.progress
          )
      );
    };
}