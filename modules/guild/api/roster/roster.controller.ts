import type {
  RequestHandler
} from "express";
import { GuildRosterService } from "./roster.service.js";
import {
  guildMemberIdSchema,
  guildMemberInputSchema
} from "./roster.validation.js";

export class GuildRosterController {
  constructor(
    private readonly service:
      GuildRosterService
  ) {}

  list: RequestHandler = async (
    _request,
    response
  ) => {
    const members =
      await this.service.list();

    response.json({
      items: members,
      total: members.length
    });
  };

  create: RequestHandler = async (
    request,
    response
  ) => {
    const input =
      guildMemberInputSchema.parse(
        request.body
      );

    const member =
      await this.service.create(
        input
      );

    response
      .status(201)
      .json(member);
  };

  update: RequestHandler = async (
    request,
    response
  ) => {
    const memberId =
      guildMemberIdSchema.parse(
        request.params.memberId
      );

    const input =
      guildMemberInputSchema.parse(
        request.body
      );

    const member =
      await this.service.update(
        memberId,
        input
      );

    response.json(member);
  };

  delete: RequestHandler = async (
    request,
    response
  ) => {
    const memberId =
      guildMemberIdSchema.parse(
        request.params.memberId
      );

    await this.service.delete(
      memberId
    );

    response.status(204).send();
  };
}
