import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { GuildVerificationService } from "../verification/verification.service.js";
import { GuildOfficerNoteRepository } from "./officer-note.repository.js";
import type { GuildOfficerNoteInput } from "./officer-note.types.js";

export class GuildOfficerNoteService {
  constructor(
    private readonly repository:
      GuildOfficerNoteRepository,

    private readonly verification:
      GuildVerificationService
  ) {}

  count() {
    return this.repository.count();
  }

  async listForMember(
    memberId: string
  ) {
    const member =
      await this.repository.findMemberById(
        memberId
      );

    if (!member) {
      throw new AppError(
        404,
        "Gildenmitglied nicht gefunden."
      );
    }

    return this.repository.findByMember(
      memberId
    );
  }

  async create(
    input: GuildOfficerNoteInput
  ) {
    await this.verification.ensureVerified();

    const member =
      await this.repository.findMemberById(
        input.memberId
      );

    if (!member) {
      throw new AppError(
        404,
        "Gildenmitglied nicht gefunden."
      );
    }

    const status =
      await this.verification.getStatus();

    return this.repository.create({
      memberId: input.memberId,
      authorCharacter:
        status.verifiedCharacter ??
        "Unknown",
      body: input.body.trim()
    });
  }

  async delete(
    noteId: string
  ) {
    await this.verification.ensureVerified();

    const note =
      await this.repository.findById(
        noteId
      );

    if (!note) {
      throw new AppError(
        404,
        "Notiz nicht gefunden."
      );
    }

    await this.repository.delete(
      noteId
    );
  }
}
