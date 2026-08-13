import type {
  RequestHandler
} from "express";
import { GuildOfficerNoteService } from "./officer-note.service.js";
import {
  guildMemberIdParamSchema,
  guildOfficerNoteIdSchema,
  guildOfficerNoteInputSchema
} from "./officer-note.validation.js";

export class GuildOfficerNoteController {
  constructor(
    private readonly service:
      GuildOfficerNoteService
  ) {}

  count: RequestHandler = async (
    _request,
    response
  ) => {
    response.json({
      total:
        await this.service.count()
    });
  };

  listForMember: RequestHandler = async (
    request,
    response
  ) => {
    const memberId =
      guildMemberIdParamSchema.parse(
        request.params.memberId
      );

    const notes =
      await this.service.listForMember(
        memberId
      );

    response.json({
      items: notes,
      total: notes.length
    });
  };

  create: RequestHandler = async (
    request,
    response
  ) => {
    const input =
      guildOfficerNoteInputSchema.parse(
        request.body
      );

    const note =
      await this.service.create(
        input
      );

    response
      .status(201)
      .json(note);
  };

  delete: RequestHandler = async (
    request,
    response
  ) => {
    const noteId =
      guildOfficerNoteIdSchema.parse(
        request.params.noteId
      );

    await this.service.delete(
      noteId
    );

    response.status(204).send();
  };
}
