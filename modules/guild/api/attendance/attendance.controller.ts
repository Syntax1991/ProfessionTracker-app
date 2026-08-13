import type {
  RequestHandler
} from "express";
import { GuildAttendanceService } from "./attendance.service.js";
import {
  guildAttendanceEventIdSchema,
  guildAttendanceEventInputSchema,
  guildAttendanceMemberIdSchema,
  guildAttendanceRecordInputSchema
} from "./attendance.validation.js";

export class GuildAttendanceController {
  constructor(
    private readonly service:
      GuildAttendanceService
  ) {}

  listEvents: RequestHandler = async (
    _request,
    response
  ) => {
    const events =
      await this.service.listEvents();

    response.json({
      items: events,
      total: events.length
    });
  };

  createEvent: RequestHandler = async (
    request,
    response
  ) => {
    const input =
      guildAttendanceEventInputSchema.parse(
        request.body
      );

    const event =
      await this.service.createEvent(
        input
      );

    response
      .status(201)
      .json(event);
  };

  updateEvent: RequestHandler = async (
    request,
    response
  ) => {
    const eventId =
      guildAttendanceEventIdSchema.parse(
        request.params.eventId
      );

    const input =
      guildAttendanceEventInputSchema.parse(
        request.body
      );

    const event =
      await this.service.updateEvent(
        eventId,
        input
      );

    response.json(event);
  };

  deleteEvent: RequestHandler = async (
    request,
    response
  ) => {
    const eventId =
      guildAttendanceEventIdSchema.parse(
        request.params.eventId
      );

    await this.service.deleteEvent(
      eventId
    );

    response.status(204).send();
  };

  setRecord: RequestHandler = async (
    request,
    response
  ) => {
    const eventId =
      guildAttendanceEventIdSchema.parse(
        request.params.eventId
      );

    const memberId =
      guildAttendanceMemberIdSchema.parse(
        request.params.memberId
      );

    const input =
      guildAttendanceRecordInputSchema.parse(
        request.body
      );

    const event =
      await this.service.setRecord(
        eventId,
        memberId,
        input.status
      );

    response.json(event);
  };

  clearRecord: RequestHandler = async (
    request,
    response
  ) => {
    const eventId =
      guildAttendanceEventIdSchema.parse(
        request.params.eventId
      );

    const memberId =
      guildAttendanceMemberIdSchema.parse(
        request.params.memberId
      );

    const event =
      await this.service.clearRecord(
        eventId,
        memberId
      );

    response.json(event);
  };
}
