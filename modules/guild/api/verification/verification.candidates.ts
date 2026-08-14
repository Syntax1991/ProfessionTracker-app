import { mapWithConcurrency } from "../../../../apps/api/src/shared/async/mapWithConcurrency.js";
import { normalizeBattleNetCharacters } from "../../../data-platform/api/integrations/battlenet/battlenet-import.mapper.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import { extractGuildSlugFromHref } from "./verification.guild-slug.js";
import type { GuildVerificationCandidate } from "./verification.types.js";

const candidateFetchConcurrency = 4;

export async function listGuildCandidatesFromCharacters(
  battleNetClient: BattleNetClient,
  accessToken: string
): Promise<
  GuildVerificationCandidate[]
> {
  const accountProfile =
    await battleNetClient.getAccountProfile(
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
          await battleNetClient.getCharacterProfile(
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
