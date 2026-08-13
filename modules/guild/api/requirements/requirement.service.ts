import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { GuildVerificationGuard } from "../verification/verification.types.js";
import { GuildRequirementRepository } from "./requirement.repository.js";
import type { GuildRequirementInput } from "./requirement.types.js";

export class GuildRequirementService {
  constructor(
    private readonly repository:
      GuildRequirementRepository,

    private readonly verification:
      GuildVerificationGuard
  ) {}

  list() {
    return this.repository.findAll();
  }

  async create(
    input: GuildRequirementInput
  ) {
    await this.verification.ensureVerified();

    return this.repository.create(
      this.normalize(input)
    );
  }

  async update(
    requirementId: string,
    input: GuildRequirementInput
  ) {
    await this.verification.ensureVerified();

    const existing =
      await this.repository.findById(
        requirementId
      );

    if (!existing) {
      throw new AppError(
        404,
        "Anforderung nicht gefunden."
      );
    }

    return this.repository.update(
      requirementId,
      this.normalize(input)
    );
  }

  async delete(
    requirementId: string
  ) {
    await this.verification.ensureVerified();

    const existing =
      await this.repository.findById(
        requirementId
      );

    if (!existing) {
      throw new AppError(
        404,
        "Anforderung nicht gefunden."
      );
    }

    await this.repository.delete(
      requirementId
    );
  }

  private normalize(
    input: GuildRequirementInput
  ): GuildRequirementInput {
    return {
      ...input,
      title: input.title.trim(),
      description:
        input.description?.trim() ||
        null
    };
  }
}
