import type {
  RequestHandler
} from "express";
import { GuildTeamService } from "./team.service.js";
import {
  guildTeamIdSchema,
  guildTeamInputSchema,
  guildTeamMemberInputSchema
} from "./team.validation.js";

export class GuildTeamController {
  constructor(
    private readonly service:
      GuildTeamService
  ) {}

  list: RequestHandler = async (
    _request,
    response
  ) => {
    const teams =
      await this.service.list();

    response.json({
      items: teams,
      total: teams.length
    });
  };

  create: RequestHandler = async (
    request,
    response
  ) => {
    const input =
      guildTeamInputSchema.parse(
        request.body
      );

    const team =
      await this.service.create(
        input
      );

    response
      .status(201)
      .json(team);
  };

  update: RequestHandler = async (
    request,
    response
  ) => {
    const teamId =
      guildTeamIdSchema.parse(
        request.params.teamId
      );

    const input =
      guildTeamInputSchema.parse(
        request.body
      );

    const team =
      await this.service.update(
        teamId,
        input
      );

    response.json(team);
  };

  delete: RequestHandler = async (
    request,
    response
  ) => {
    const teamId =
      guildTeamIdSchema.parse(
        request.params.teamId
      );

    await this.service.delete(
      teamId
    );

    response.status(204).send();
  };

  addMember: RequestHandler = async (
    request,
    response
  ) => {
    const teamId =
      guildTeamIdSchema.parse(
        request.params.teamId
      );

    const input =
      guildTeamMemberInputSchema.parse(
        request.body
      );

    const team =
      await this.service.addMember(
        teamId,
        input
      );

    response.json(team);
  };

  removeMember: RequestHandler = async (
    request,
    response
  ) => {
    const teamId =
      guildTeamIdSchema.parse(
        request.params.teamId
      );

    const memberId =
      guildTeamIdSchema.parse(
        request.params.memberId
      );

    const team =
      await this.service.removeMember(
        teamId,
        memberId
      );

    response.json(team);
  };
}
