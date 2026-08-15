import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { normalizeBattleNetCharacters } from "../../../data-platform/api/integrations/battlenet/battlenet-import.mapper.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import { slugify } from "./verification.guild-slug.js";
import type {
  GuildVerificationCandidate,
  GuildVerificationLookupInput
} from "./verification.types.js";

/** Looks up a guild by name and returns only the requester's own characters found in it. Split out of GuildVerificationService purely to stay under the project's 350-line file limit. */
export async function lookupGuildByName(
  battleNetClient: BattleNetClient,
  accessToken: string,
  input: GuildVerificationLookupInput
): Promise<GuildVerificationCandidate> {
  const realmSlug = slugify(input.realmName);
  const guildSlug = slugify(input.guildName);

  const roster = await battleNetClient.getGuildRoster(
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
    await battleNetClient.getAccountProfile(accessToken);

  const myCharacters = normalizeBattleNetCharacters(accountProfile);

  const myCharactersInGuild = myCharacters.filter((character) =>
    roster.members?.some(
      (member) =>
        member.character?.name?.toLowerCase() ===
          character.name.toLowerCase() &&
        member.character?.realm?.slug === character.realmSlug
    )
  );

  if (myCharactersInGuild.length === 0) {
    throw new AppError(
      403,
      `Keiner deiner Battle.net-Charaktere ist Mitglied in ${roster.guild.name}.`
    );
  }

  return {
    guildName: roster.guild.name,
    guildSlug,
    realmName: roster.guild.realm?.name ?? input.realmName,
    realmSlug: roster.guild.realm?.slug ?? realmSlug,
    faction: roster.guild.faction?.name ?? null,
    characters: myCharactersInGuild.map((character) => ({
      name: character.name,
      realmSlug: character.realmSlug,
      level: character.level
    }))
  };
}
