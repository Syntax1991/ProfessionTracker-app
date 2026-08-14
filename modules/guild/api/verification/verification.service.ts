import { env } from "../../../../apps/api/src/config/env.js";
import { mapWithConcurrency } from "../../../../apps/api/src/shared/async/mapWithConcurrency.js";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { normalizeBattleNetCharacters } from "../../../data-platform/api/integrations/battlenet/battlenet-import.mapper.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import type { RaiderAccessTokenGuard } from "../../../data-platform/api/raider-auth/raider-auth.types.js";
import { extractGuildSlugFromHref } from "./verification.guild-slug.js";
import { GuildVerificationRepository } from "./verification.repository.js";
import type {
  GuildVerificationCandidate,
  GuildVerificationInput,
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

const candidateFetchConcurrency = 4;

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

    const accountProfile =
      await this.battleNetClient.getAccountProfile(
        accessToken
      );

    const characters =
      normalizeBattleNetCharacters(
        accountProfile
      );

    const profiles =
      await mapWithConcurrency(
        characters,
        candidateFetchConcurrency,
        async (character) => ({
          character,
          profile:
            await this.battleNetClient.getCharacterProfile(
              accessToken,
              character.realmSlug,
              character.name
            )
        })
      );

    const candidatesBySlug =
      new Map<
        string,
        GuildVerificationCandidate
      >();

    for (
      const { character, profile } of
      profiles
    ) {
      const guild = profile?.guild;
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
        continue;
      }

      const key =
        `${guildRealmSlug}:${guildSlug}`;

      const candidateCharacter = {
        name: character.name,
        realmSlug:
          character.realmSlug,
        level: character.level
      };

      const existing =
        candidatesBySlug.get(key);

      if (existing) {
        existing.characters.push(
          candidateCharacter
        );

        continue;
      }

      candidatesBySlug.set(key, {
        guildName: guild.name,
        guildSlug,
        realmName:
          guild.realm?.name ??
          guildRealmSlug,
        realmSlug: guildRealmSlug,
        faction:
          guild.faction?.name ??
          null,
        characters: [
          candidateCharacter
        ]
      });
    }

    return [
      ...candidatesBySlug.values()
    ];
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
