import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { GuildVerificationGuard } from "../../../guild/api/verification/verification.types.js";
import { RaidCooldownRepository } from "./cooldown.repository.js";
import type { RaidCooldownAssignmentInput } from "./cooldown.types.js";

export class RaidCooldownService {
  constructor(
    private readonly repository:
      RaidCooldownRepository,

    private readonly verification:
      GuildVerificationGuard
  ) {}

  listForEvent(eventId: string) {
    return this.repository.findForEvent(
      eventId
    );
  }

  async createAssignment(
    bossId: string,
    input: RaidCooldownAssignmentInput
  ) {
    await this.verification.ensureVerified();

    const boss =
      await this.repository.findBossById(
        bossId
      );

    if (!boss) {
      throw new AppError(
        404,
        "Boss nicht gefunden."
      );
    }

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

    return this.repository.createAssignment(
      bossId,
      this.normalize(input)
    );
  }

  async updateAssignment(
    assignmentId: string,
    input: RaidCooldownAssignmentInput
  ) {
    await this.verification.ensureVerified();

    const assignment =
      await this.repository.findAssignmentById(
        assignmentId
      );

    if (!assignment) {
      throw new AppError(
        404,
        "Cooldown-Zuweisung nicht gefunden."
      );
    }

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

    return this.repository.updateAssignment(
      assignmentId,
      this.normalize(input)
    );
  }

  async deleteAssignment(
    assignmentId: string
  ) {
    await this.verification.ensureVerified();

    const assignment =
      await this.repository.findAssignmentById(
        assignmentId
      );

    if (!assignment) {
      throw new AppError(
        404,
        "Cooldown-Zuweisung nicht gefunden."
      );
    }

    await this.repository.deleteAssignment(
      assignmentId
    );
  }

  private normalize(
    input: RaidCooldownAssignmentInput
  ): RaidCooldownAssignmentInput {
    return {
      ...input,
      abilityName:
        input.abilityName.trim(),
      phaseLabel:
        input.phaseLabel?.trim() ||
        null
    };
  }
}
