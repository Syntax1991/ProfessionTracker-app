import type {
  RequestHandler
} from "express";
import { RaidBossRosterService } from "./boss-roster.service.js";
import {
  raidBossIdSchema,
  raidBossInputSchema,
  raidBossMemberIdSchema,
  raidBossRosterEntryInputSchema,
  raidEventIdParamSchema
} from "./boss-roster.validation.js";

export class RaidBossRosterController {
  constructor(
    private readonly service:
      RaidBossRosterService
  ) {}

  listForEvent: RequestHandler = async (
    request,
    response
  ) => {
    const eventId =
      raidEventIdParamSchema.parse(
        request.params.eventId
      );

    const bosses =
      await this.service.listForEvent(
        eventId
      );

    response.json({
      items: bosses,
      total: bosses.length
    });
  };

  createBoss: RequestHandler = async (
    request,
    response
  ) => {
    const eventId =
      raidEventIdParamSchema.parse(
        request.params.eventId
      );

    const input =
      raidBossInputSchema.parse(
        request.body
      );

    const boss =
      await this.service.createBoss(
        eventId,
        input
      );

    response
      .status(201)
      .json(boss);
  };

  updateBoss: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidBossIdSchema.parse(
        request.params.bossId
      );

    const input =
      raidBossInputSchema.parse(
        request.body
      );

    const boss =
      await this.service.updateBoss(
        bossId,
        input
      );

    response.json(boss);
  };

  deleteBoss: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidBossIdSchema.parse(
        request.params.bossId
      );

    await this.service.deleteBoss(
      bossId
    );

    response.status(204).send();
  };

  setEntry: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidBossIdSchema.parse(
        request.params.bossId
      );

    const memberId =
      raidBossMemberIdSchema.parse(
        request.params.memberId
      );

    const input =
      raidBossRosterEntryInputSchema.parse(
        request.body
      );

    const boss =
      await this.service.setEntry(
        bossId,
        memberId,
        input.status
      );

    response.json(boss);
  };

  clearEntry: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidBossIdSchema.parse(
        request.params.bossId
      );

    const memberId =
      raidBossMemberIdSchema.parse(
        request.params.memberId
      );

    const boss =
      await this.service.clearEntry(
        bossId,
        memberId
      );

    response.json(boss);
  };
}
