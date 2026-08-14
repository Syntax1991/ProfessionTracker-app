import { env } from "../../../../apps/api/src/config/env.js";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { RaiderSessionGuard } from "../../../data-platform/api/raider-auth/raider-auth.types.js";
import { GuildRosterRepository } from "../roster/roster.repository.js";
import { RaiderLinkRepository } from "./raider-link.repository.js";

export class GuildRaiderLinkService {
  constructor(
    private readonly repository:
      RaiderLinkRepository,

    private readonly rosterRepository:
      GuildRosterRepository,

    private readonly raiderAuth:
      RaiderSessionGuard
  ) {}

  async resolve(token: string) {
    const session =
      await this.raiderAuth.requireSession(
        token
      );

    const linkedMember =
      await this.repository.findMemberByLinkedAccount(
        session.raiderAccountId
      );

    if (linkedMember) {
      return {
        status: "linked" as const,
        member: linkedMember
      };
    }

    const candidates =
      await this.findCandidates(
        session.characters
      );

    if (candidates.length === 0) {
      return {
        status: "unmatched" as const
      };
    }

    const [
      onlyCandidate
    ] = candidates;

    if (
      candidates.length === 1 &&
      onlyCandidate
    ) {
      const member =
        await this.repository.linkMember(
          onlyCandidate.id,
          session.raiderAccountId
        );

      return {
        status: "linked" as const,
        member
      };
    }

    return {
      status: "choose" as const,
      candidates
    };
  }

  async claim(
    token: string,
    memberId: string
  ) {
    const session =
      await this.raiderAuth.requireSession(
        token
      );

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

    if (
      member.linkedRaiderAccountId &&
      member.linkedRaiderAccountId !==
        session.raiderAccountId
    ) {
      throw new AppError(
        409,
        "Dieses Gildenmitglied ist bereits mit einem anderen Battle.net-Konto verknüpft."
      );
    }

    const ownsCharacter =
      member.region ===
        env.BATTLENET_REGION &&
      session.characters.some(
        (character) =>
          character.name.toLowerCase() ===
            member.name.toLowerCase() &&
          character.realm.toLowerCase() ===
            member.realm.toLowerCase()
      );

    if (!ownsCharacter) {
      throw new AppError(
        403,
        `${member.name} ist keiner deiner eigenen Battle.net-Charaktere.`
      );
    }

    return this.repository.linkMember(
      memberId,
      session.raiderAccountId
    );
  }

  async getLinkedMember(
    token: string
  ) {
    const session =
      await this.raiderAuth.requireSession(
        token
      );

    return this.repository.findMemberByLinkedAccount(
      session.raiderAccountId
    );
  }

  private async findCandidates(
    characters: Array<{
      name: string;
      realm: string;
    }>
  ) {
    const members =
      await this.rosterRepository.findAll();

    return members.filter(
      (member) =>
        !member.linkedRaiderAccountId &&
        member.region ===
          env.BATTLENET_REGION &&
        characters.some(
          (character) =>
            character.name.toLowerCase() ===
              member.name.toLowerCase() &&
            character.realm.toLowerCase() ===
              member.realm.toLowerCase()
        )
    );
  }
}
