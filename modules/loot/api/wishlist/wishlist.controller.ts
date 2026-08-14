import type {
  RequestHandler
} from "express";
import { requireBearerToken } from "../../../../apps/api/src/shared/http/bearerToken.js";
import { LootWishlistService } from "./wishlist.service.js";
import {
  lootTierSlotParamSchema,
  lootTierStatusInputSchema,
  lootTrinketChoiceInputSchema,
  lootTrinketRankParamSchema
} from "./wishlist.validation.js";

export class LootWishlistController {
  constructor(
    private readonly service:
      LootWishlistService
  ) {}

  getMyWishlist: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    response.json(
      await this.service.getMyWishlist(
        token
      )
    );
  };

  setTierStatus: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const tierSlot =
      lootTierSlotParamSchema.parse(
        request.params.tierSlot
      );

    const input =
      lootTierStatusInputSchema.parse(
        request.body
      );

    response.json(
      await this.service.setTierStatus(
        token,
        tierSlot,
        input.status
      )
    );
  };

  clearTierStatus: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const tierSlot =
      lootTierSlotParamSchema.parse(
        request.params.tierSlot
      );

    await this.service.clearTierStatus(
      token,
      tierSlot
    );

    response.status(204).send();
  };

  setTrinketChoice: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const rank =
      lootTrinketRankParamSchema.parse(
        request.params.rank
      );

    const input =
      lootTrinketChoiceInputSchema.parse(
        request.body
      );

    response.json(
      await this.service.setTrinketChoice(
        token,
        rank,
        input.itemId
      )
    );
  };

  clearTrinketChoice: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    const rank =
      lootTrinketRankParamSchema.parse(
        request.params.rank
      );

    await this.service.clearTrinketChoice(
      token,
      rank
    );

    response.status(204).send();
  };
}
