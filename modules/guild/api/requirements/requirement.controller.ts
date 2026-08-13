import type {
  RequestHandler
} from "express";
import { GuildRequirementService } from "./requirement.service.js";
import {
  guildRequirementIdSchema,
  guildRequirementInputSchema
} from "./requirement.validation.js";

export class GuildRequirementController {
  constructor(
    private readonly service:
      GuildRequirementService
  ) {}

  list: RequestHandler = async (
    _request,
    response
  ) => {
    const requirements =
      await this.service.list();

    response.json({
      items: requirements,
      total:
        requirements.length
    });
  };

  create: RequestHandler = async (
    request,
    response
  ) => {
    const input =
      guildRequirementInputSchema.parse(
        request.body
      );

    const requirement =
      await this.service.create(
        input
      );

    response
      .status(201)
      .json(requirement);
  };

  update: RequestHandler = async (
    request,
    response
  ) => {
    const requirementId =
      guildRequirementIdSchema.parse(
        request.params
          .requirementId
      );

    const input =
      guildRequirementInputSchema.parse(
        request.body
      );

    const requirement =
      await this.service.update(
        requirementId,
        input
      );

    response.json(
      requirement
    );
  };

  delete: RequestHandler = async (
    request,
    response
  ) => {
    const requirementId =
      guildRequirementIdSchema.parse(
        request.params
          .requirementId
      );

    await this.service.delete(
      requirementId
    );

    response.status(204).send();
  };
}
