import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { GuildVerificationGuard } from "../verification/verification.types.js";
import { GuildAttendanceRepository } from "./attendance.repository.js";
import type { GuildAttendanceEventInput } from "./attendance.types.js";

export class GuildAttendanceService {
  constructor(
    private readonly repository:
      GuildAttendanceRepository,

    private readonly verification:
      GuildVerificationGuard
  ) {}

  listEvents() {
    return this.repository.findAllEvents();
  }

  async createEvent(
    input: GuildAttendanceEventInput
  ) {
    await this.verification.ensureVerified();

    return this.repository.createEvent(
      this.normalize(input)
    );
  }

  async updateEvent(
    eventId: string,
    input: GuildAttendanceEventInput
  ) {
    await this.verification.ensureVerified();

    const existing =
      await this.repository.findEventById(
        eventId
      );

    if (!existing) {
      throw new AppError(
        404,
        "Termin nicht gefunden."
      );
    }

    return this.repository.updateEvent(
      eventId,
      this.normalize(input)
    );
  }

  async deleteEvent(
    eventId: string
  ) {
    await this.verification.ensureVerified();

    const existing =
      await this.repository.findEventById(
        eventId
      );

    if (!existing) {
      throw new AppError(
        404,
        "Termin nicht gefunden."
      );
    }

    await this.repository.deleteEvent(
      eventId
    );
  }

  async setRecord(
    eventId: string,
    memberId: string,
    status: string
  ) {
    await this.verification.ensureVerified();

    const event =
      await this.repository.findEventById(
        eventId
      );

    if (!event) {
      throw new AppError(
        404,
        "Termin nicht gefunden."
      );
    }

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

    await this.repository.upsertRecord(
      eventId,
      memberId,
      status
    );

    return this.repository.findEventById(
      eventId
    );
  }

  async clearRecord(
    eventId: string,
    memberId: string
  ) {
    await this.verification.ensureVerified();

    const event =
      await this.repository.findEventById(
        eventId
      );

    if (!event) {
      throw new AppError(
        404,
        "Termin nicht gefunden."
      );
    }

    await this.repository.deleteRecord(
      eventId,
      memberId
    );

    return this.repository.findEventById(
      eventId
    );
  }

  private normalize(
    input: GuildAttendanceEventInput
  ): GuildAttendanceEventInput {
    return {
      ...input,
      title: input.title.trim(),
      raidName:
        input.raidName?.trim() ||
        null,
      notes:
        input.notes?.trim() ||
        null
    };
  }
}
