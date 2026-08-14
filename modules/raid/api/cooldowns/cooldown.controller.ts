import type {
  RequestHandler
} from "express";
import { RaidCooldownService } from "./cooldown.service.js";
import {
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
}
