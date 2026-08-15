import { env } from "../../../../apps/api/src/config/env.js";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import type { RaiderAccessTokenGuard } from "../../../data-platform/api/raider-auth/raider-auth.types.js";
import { listGuildCandidatesFromCharacters } from "./verification.candidates.js";
import { extractGuildSlugFromHref } from "./verification.guild-slug.js";
import { lookupGuildByName } from "./verification.lookup.js";
import { OfficerAuthorizationCache } from "./verification.officer-cache.js";
import {
  LEADERSHIP_RANK_THRESHOLD,
  verifyCurrentOfficerRank
} from "./verification.officer-check.js";
import { GuildVerificationRepository } from "./verification.repository.js";
import type {
  GuildVerificationCandidate,
  GuildVerificationInput,
  GuildVerificationLookupInput,
  GuildVerificationStatus,
  LinkedGuildMemberLookup
} from "./verification.types.js";

export class GuildVerificationService {
  private readonly officerCache: OfficerAuthorizationCache;

  constructor(
    private readonly repository:
      GuildVerificationRepository,

    private readonly raiderAuth:
      RaiderAccessTokenGuard,

    private readonly battleNetClient:
      BattleNetClient,

    private readonly raiderLink:
      LinkedGuildMemberLookup,

    officerCache?: OfficerAuthorizationCache
  ) {
    this.officerCache =
      officerCache ??
      new OfficerAuthorizationCache();
  }

  async listCandidates(
    token: string
  ): Promise<
    GuildVerificationCandidate[]
  > {
    const { accessToken } =
      await this.raiderAuth.requireUsableAccessToken(
        token
      );

    return listGuildCandidatesFromCharacters(
      this.battleNetClient,
      accessToken
    );
  }

  async lookupGuild(
    token: string,
    input: GuildVerificationLookupInput
  ): Promise<GuildVerificationCandidate> {
    const { accessToken } =
      await this.raiderAuth.requireUsableAccessToken(
        token
      );

    return lookupGuildByName(
      this.battleNetClient,
      accessToken,
      input
    );
  }

  async verify(
    token: string,
    input: GuildVerificationInput
  ): Promise<GuildVerificationStatus> {
    const { accessToken } =
      await this.raiderAuth.requireUsableAccessToken(
        token
      );

    const characterProfile =
      await this.battleNetClient.getCharacterProfile(
        accessToken,
        input.characterRealmSlug,
        input.characterName
      );

    const guild =
      characterProfile?.guild;

    const guildRealmSlug =
      guild?.realm?.slug;

    const guildSlug =
      extractGuildSlugFromHref(
        guild?.key?.href
      );

    if (
      !guild?.name ||
      !guildRealmSlug ||
      !guildSlug
    ) {
      throw new AppError(
        400,
        `${input.characterName} ist aktuell in keiner Gilde.`
      );
    }

    const roster =
      await this.battleNetClient.getGuildRoster(
        accessToken,
        guildRealmSlug,
        guildSlug
      );

    const membership =
      roster?.members?.find(
        (member) =>
          member.character?.name?.toLowerCase() ===
            input.characterName.toLowerCase() &&
          member.character?.realm
            ?.slug ===
            input.characterRealmSlug
      );

    if (
      !membership ||
      typeof membership.rank !==
        "number"
    ) {
      throw new AppError(
        404,
        `${input.characterName} wurde im Gilden-Roster von ${guild.name} nicht gefunden.`
      );
    }

    if (
      membership.rank >
      LEADERSHIP_RANK_THRESHOLD
    ) {
      throw new AppError(
        403,
        `${input.characterName} hat Rang ${membership.rank} in ${guild.name}. Blizzard liefert keine Rangnamen, daher zählt nur Rang 0-${LEADERSHIP_RANK_THRESHOLD} (Gildenleitung) als autorisiert.`
      );
    }

    await this.repository.save({
      guildName: guild.name,
      realmName:
        guild.realm?.name ??
        guildRealmSlug,
      realmSlug: guildRealmSlug,
      region:
        env.BATTLENET_REGION,
      faction:
        guild.faction?.name ??
        null,
      memberCount:
        roster?.members?.length ??
        null,
      verifiedCharacter:
        input.characterName,
      verifiedRealmSlug:
        input.characterRealmSlug,
      verifiedRank:
        membership.rank
    });

    return this.getStatus();
  }

  async getStatus(): Promise<GuildVerificationStatus> {
    const verification =
      await this.repository.find();

    if (!verification) {
      return {
        verified: false,
        guildName: null,
        realmName: null,
        verifiedCharacter: null,
        verifiedRank: null,
        isGuildMaster: false,
        leadershipThreshold:
          LEADERSHIP_RANK_THRESHOLD,
        verifiedAt: null
      };
    }

    return {
      verified: true,
      guildName:
        verification.guildName,
      realmName:
        verification.realmName,
      verifiedCharacter:
        verification.verifiedCharacter,
      verifiedRank:
        verification.verifiedRank,
      isGuildMaster:
        verification.verifiedRank ===
        0,
      leadershipThreshold:
        verification.leadershipThreshold,
      verifiedAt:
        verification.verifiedAt.toISOString()
    };
  }

  async clear(
    token: string
  ): Promise<void> {
    await this.raiderAuth.requireUsableAccessToken(
      token
    );

    await this.repository.clear();
  }

  async ensureVerified(): Promise<void> {
    const verification =
      await this.repository.find();

    if (!verification) {
      throw new AppError(
        403,
        "Die Gildenleitung muss den Roster zuerst über Battle.net verifizieren, bevor er verwaltet werden kann."
      );
    }
  }

  /**
   * Proves that the CURRENT requester (not just "someone, once") is
   * a real, live guild officer — unlike ensureVerified(), which only
   * checks that the guild was verified by anyone at some point. Two
   * live Blizzard calls on a cache miss; cached per member for a few
   * minutes afterward (see OfficerAuthorizationCache).
   */
  async requireCurrentOfficer(
    token: string
  ): Promise<{ id: string }> {
    const member =
      await this.raiderLink.getLinkedMember(
        token
      );

    if (!member) {
      throw new AppError(
        403,
        "Kein verknüpfter Charakter gefunden. Bitte zuerst deinen Charakter verknüpfen."
      );
    }

    if (
      this.officerCache.isVerified(
        member.id
      )
    ) {
      return { id: member.id };
    }

    const { accessToken } =
      await this.raiderAuth.requireUsableAccessToken(
        token
      );

    await verifyCurrentOfficerRank(
      this.battleNetClient,
      accessToken,
      member
    );

    this.officerCache.markVerified(
      member.id
    );

    return { id: member.id };
  }
}
