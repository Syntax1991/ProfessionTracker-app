import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { GuildVerificationGuard } from "../verification/verification.types.js";
import { GuildTeamRepository } from "./team.repository.js";
import type {
  GuildTeamInput,
  GuildTeamMemberInput
} from "./team.types.js";

export class GuildTeamService {
  constructor(
    private readonly repository:
      GuildTeamRepository,

    private readonly verification:
      GuildVerificationGuard
  ) {}

  list() {
    return this.repository.findAll();
  }

  async create(
    input: GuildTeamInput
  ) {
    await this.verification.ensureVerified();

    const normalizedInput =
      this.normalize(input);

    const existing =
      await this.repository.findByName(
        normalizedInput.name
      );

    if (existing) {
      throw new AppError(
        409,
        "Ein Team mit diesem Namen existiert bereits."
      );
    }

    return this.repository.create(
      normalizedInput
    );
  }

  async update(
    teamId: string,
    input: GuildTeamInput
  ) {
    await this.verification.ensureVerified();

    const currentTeam =
      await this.repository.findById(
        teamId
      );

    if (!currentTeam) {
      throw new AppError(
        404,
        "Team nicht gefunden."
      );
    }

    const normalizedInput =
      this.normalize(input);

    const duplicate =
      await this.repository.findByName(
        normalizedInput.name
      );

    if (
      duplicate &&
      duplicate.id !== teamId
    ) {
      throw new AppError(
        409,
        "Ein anderes Team verwendet bereits diesen Namen."
      );
    }

    return this.repository.update(
      teamId,
      normalizedInput
    );
  }

  async delete(
    teamId: string
  ) {
    await this.verification.ensureVerified();

    const team =
      await this.repository.findById(
        teamId
      );

    if (!team) {
      throw new AppError(
        404,
        "Team nicht gefunden."
      );
    }

    await this.repository.delete(
      teamId
    );
  }

  async addMember(
    teamId: string,
    input: GuildTeamMemberInput
  ) {
    await this.verification.ensureVerified();

    const team =
      await this.repository.findById(
        teamId
      );

    if (!team) {
      throw new AppError(
        404,
        "Team nicht gefunden."
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

    await this.repository.addMember(
      teamId,
      input
    );

    return this.repository.findById(
      teamId
    );
  }

  async removeMember(
    teamId: string,
    memberId: string
  ) {
    await this.verification.ensureVerified();

    const team =
      await this.repository.findById(
        teamId
      );

    if (!team) {
      throw new AppError(
        404,
        "Team nicht gefunden."
      );
    }

    await this.repository.removeMember(
      teamId,
      memberId
    );

    return this.repository.findById(
      teamId
    );
  }

  private normalize(
    input: GuildTeamInput
  ): GuildTeamInput {
    return {
      ...input,
      name: input.name.trim(),
      description:
        input.description?.trim() ||
        null,
      color:
        input.color?.trim() ||
        null
    };
  }
}
