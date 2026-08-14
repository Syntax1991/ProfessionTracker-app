import type {
  RequestHandler
} from "express";
import { RaidCooldownService } from "./cooldown.service.js";
import {
  raidBossFightDurationInputSchema,
  raidBossPhaseMarkerIdSchema,
  raidBossPhaseMarkerInputSchema,
  raidCooldownAssignmentIdSchema,
  raidCooldownAssignmentInputSchema,
  raidCooldownBossIdSchema,
  raidCooldownEventIdParamSchema
} from "./cooldown.validation.js";

export class RaidCooldownController {
  constructor(
    private readonly service:
      RaidCooldownService
  ) {}

  listForEvent: RequestHandler = async (
    request,
    response
  ) => {
    const eventId =
      raidCooldownEventIdParamSchema.parse(
        request.params.eventId
      );

    const assignments =
      await this.service.listForEvent(
        eventId
      );

    response.json({
      items: assignments,
      total: assignments.length
    });
  };

  createAssignment: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidCooldownBossIdSchema.parse(
        request.params.bossId
      );

    const input =
      raidCooldownAssignmentInputSchema.parse(
        request.body
      );

    const assignment =
      await this.service.createAssignment(
        bossId,
        {
          ...input,
          phaseLabel:
            input.phaseLabel ??
            null,
          timestampSeconds:
            input.timestampSeconds ??
            null
        }
      );

    response
      .status(201)
      .json(assignment);
  };

  updateAssignment: RequestHandler = async (
    request,
    response
  ) => {
    const assignmentId =
      raidCooldownAssignmentIdSchema.parse(
        request.params.assignmentId
      );

    const input =
      raidCooldownAssignmentInputSchema.parse(
        request.body
      );

    const assignment =
      await this.service.updateAssignment(
        assignmentId,
        {
          ...input,
          phaseLabel:
            input.phaseLabel ??
            null,
          timestampSeconds:
            input.timestampSeconds ??
            null
        }
      );

    response.json(assignment);
  };

  deleteAssignment: RequestHandler = async (
    request,
    response
  ) => {
    const assignmentId =
      raidCooldownAssignmentIdSchema.parse(
        request.params.assignmentId
      );

    await this.service.deleteAssignment(
      assignmentId
    );

    response.status(204).send();
  };

  updateFightDuration: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidCooldownBossIdSchema.parse(
        request.params.bossId
      );

    const input =
      raidBossFightDurationInputSchema.parse(
        request.body
      );

    const boss =
      await this.service.updateFightDuration(
        bossId,
        input
      );

    response.json(boss);
  };

  listPhaseMarkers: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidCooldownBossIdSchema.parse(
        request.params.bossId
      );

    const markers =
      await this.service.listPhaseMarkers(
        bossId
      );

    response.json({
      items: markers,
      total: markers.length
    });
  };

  createPhaseMarker: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidCooldownBossIdSchema.parse(
        request.params.bossId
      );

    const input =
      raidBossPhaseMarkerInputSchema.parse(
        request.body
      );

    const marker =
      await this.service.createPhaseMarker(
        bossId,
        input
      );

    response
      .status(201)
      .json(marker);
  };

  deletePhaseMarker: RequestHandler = async (
    request,
    response
  ) => {
    const markerId =
      raidBossPhaseMarkerIdSchema.parse(
        request.params.markerId
      );

    await this.service.deletePhaseMarker(
      markerId
    );

    response.status(204).send();
  };

  listAbilityCasts: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidCooldownBossIdSchema.parse(
        request.params.bossId
      );

    const casts =
      await this.service.listAbilityCasts(
        bossId
      );

    response.json({
      items: casts,
      total: casts.length
    });
  };

  syncBossFromWarcraftLogs: RequestHandler = async (
    request,
    response
  ) => {
    const bossId =
      raidCooldownBossIdSchema.parse(
        request.params.bossId
      );

    const result =
      await this.service.syncBossFromWarcraftLogs(
        bossId
      );

    response.json(result);
  };
}
