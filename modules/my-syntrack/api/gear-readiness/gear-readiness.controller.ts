import type { RequestHandler } from "express";
import { GearReadinessService } from "./gear-readiness.service.js";
import {
  gearCharacterIdSchema,
  gearSlotInputSchema,
  gearSlotKeySchema
} from "./gear-readiness.validation.js";

export class GearReadinessController {
  constructor(
    private readonly service:
      GearReadinessService
  ) {}

  getOverview: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.getOverview()
    );
  };

  updateSlot: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      gearCharacterIdSchema.parse(
        request.params.characterId
      );
    const slotKey =
      gearSlotKeySchema.parse(
        request.params.slotKey
      );
    const input = gearSlotInputSchema.parse(
      request.body
    );

    response.json(
      await this.service.updateSlot(
        characterId,
        slotKey,
        input
      )
    );
  };

  clearSlot: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      gearCharacterIdSchema.parse(
        request.params.characterId
      );
    const slotKey =
      gearSlotKeySchema.parse(
        request.params.slotKey
      );

    response.json(
      await this.service.clearSlot(
        characterId,
        slotKey
      )
    );
  };
}
