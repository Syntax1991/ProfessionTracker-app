import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { GuildRosterRepository } from "./roster.repository.js";
import type { GuildMemberInput } from "./roster.types.js";

export class GuildRosterService {
  constructor(
    private readonly repository:
      GuildRosterRepository
  ) {}

  list() {
    return this.repository.findAll();
  }

  async create(
    input: GuildMemberInput
  ) {
    const normalizedInput =
      this.normalize(input);

    const existingMember =
      await this.repository.findByIdentity(
        normalizedInput.name,
        normalizedInput.realm,
        normalizedInput.region
      );

    if (existingMember) {
      throw new AppError(
        409,
        "Ein Gildenmitglied mit diesem Namen, Realm und dieser Region existiert bereits."
      );
    }

    return this.repository.create(
      normalizedInput
    );
  }

  async update(
    memberId: string,
    input: GuildMemberInput
  ) {
    const currentMember =
      await this.repository.findById(
        memberId
      );

    if (!currentMember) {
      throw new AppError(
        404,
        "Gildenmitglied nicht gefunden."
      );
    }

    const normalizedInput =
      this.normalize(input);

    const duplicate =
      await this.repository.findByIdentity(
        normalizedInput.name,
        normalizedInput.realm,
        normalizedInput.region
      );

    if (
      duplicate &&
      duplicate.id !== memberId
    ) {
      throw new AppError(
        409,
        "Ein anderes Gildenmitglied verwendet bereits diese Identität."
      );
    }

    return this.repository.update(
      memberId,
      normalizedInput
    );
  }

  async delete(
    memberId: string
  ) {
    const member =
      await this.repository.findById(
        memberId
      );

    if (!member) {
      throw new AppError(
        404,
        "Gildenmitglied nicht gefunden."
      );
    }

    await this.repository.delete(
      memberId
    );
  }

  private normalize(
    input: GuildMemberInput
  ): GuildMemberInput {
    return {
      ...input,
      name: input.name.trim(),
      realm: input.realm.trim(),
      region: input.region.toLowerCase(),
      className: input.className.trim(),
      rank: input.rank.trim(),
      note:
        input.note?.trim() ||
        null,
      officerNote:
        input.officerNote?.trim() ||
        null
    };
  }
}
