import { env } from "../../../../apps/api/src/config/env.js";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { normalizeBattleNetCharacters } from "../../../data-platform/api/integrations/battlenet/battlenet-import.mapper.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import type { RaiderAccessTokenGuard } from "../../../data-platform/api/raider-auth/raider-auth.types.js";
import { listGuildCandidatesFromCharacters } from "./verification.candidates.js";
import {
  extractGuildSlugFromHref,
  slugify
} from "./verification.guild-slug.js";
import { GuildVerificationRepository } from "./verification.repository.js";
import type {
  GuildVerificationCandidate,
  GuildVerificationInput,
  GuildVerificationLookupInput,
  GuildVerificationStatus
} from "./verification.types.js";

/**
 * Blizzard's Game Data API only exposes a numeric guild rank (0 = Guild
 * Master); custom rank titles like "Officer" are never returned. Ranks
 * 0-2 are treated as guild leadership. This threshold is a fixed server
 * policy, never accepted from the client, or verification would be
 * meaningless.
 */
const LEADERSHIP_RANK_THRESHOLD = 2;

export class GuildVerificationService {
  constructor(
    private readonly repository:
      GuildVerificationRepository,

    private readonly raiderAuth:
      RaiderAccessTokenGuard,

    private readonly battleNetClient:
      BattleNetClient
  ) {}

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

    const realmSlug = slugify(
      input.realmName
    );

    const guildSlug = slugify(
      input.guildName
    );

    const roster =
      await this.battleNetClient.getGuildRoster(
        accessToken,
        realmSlug,
        guildSlug
      );

    if (!roster?.guild?.name) {
      throw new AppError(
        404,
        `Gilde "${input.guildName}" auf "${input.realmName}" wurde nicht gefunden.`
      );
    }

    const accountProfile =
      await this.battleNetClient.getAccountProfile(
        accessToken
      );

    const myCharacters =
      normalizeBattleNetCharacters(
        accountProfile
      );

    const myCharactersInGuild =
      myCharacters.filter(
        (character) =>
          roster.members?.some(
            (member) =>
              member.character
                ?.name?.toLowerCase() ===
                character.name.toLowerCase() &&
              member.character
                ?.realm?.slug ===
                character.realmSlug
          )
      );

    if (
      myCharactersInGuild.length ===
      0
    ) {
      throw new AppError(
        403,
        `Keiner deiner Battle.net-Charaktere ist Mitglied in ${roster.guild.name}.`
      );
    }

    return {
      guildName: roster.guild.name,
      guildSlug,
      realmName:
        roster.guild.realm?.name ??
        input.realmName,
      realmSlug:
        roster.guild.realm?.slug ??
        realmSlug,
      faction:
        roster.guild.faction
          ?.name ?? null,
      characters:
        myCharactersInGuild.map(
          (character) => ({
            name: character.name,
            realmSlug:
              character.realmSlug,
            level: character.level
          })
        )
    };
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
}
