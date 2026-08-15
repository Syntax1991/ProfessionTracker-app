import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import { slugifyRealmName } from "../audit/audit.realm-slug.js";
import { extractGuildSlugFromHref } from "./verification.guild-slug.js";

/**
 * Blizzard's Game Data API only exposes a numeric guild rank (0 = Guild
 * Master); custom rank titles like "Officer" are never returned. Ranks
 * 0-2 are treated as guild leadership. This threshold is a fixed server
 * policy, never accepted from the client, or verification would be
 * meaningless.
 */
export const LEADERSHIP_RANK_THRESHOLD = 2;

/**
 * Live Battle.net check: does this specific character currently hold
 * guild leadership rank? Throws AppError(403) if not. Split out of
 * GuildVerificationService purely to stay under the project's
 * 350-line file limit — same real Blizzard calls verify() already
 * trusts for this, no separate policy.
 */
export async function verifyCurrentOfficerRank(
  battleNetClient: BattleNetClient,
  accessToken: string,
  member: { name: string; realm: string }
): Promise<void> {
  const profile =
    await battleNetClient.getCharacterProfile(
      accessToken,
      slugifyRealmName(member.realm),
      member.name
    );

  const guild = profile?.guild;
  const guildRealmSlug = guild?.realm?.slug;
  const guildSlug = extractGuildSlugFromHref(
    guild?.key?.href
  );

  if (
    !guild?.name ||
    !guildRealmSlug ||
    !guildSlug
  ) {
    throw new AppError(
      403,
      `${member.name} ist aktuell in keiner Gilde.`
    );
  }

  const roster =
    await battleNetClient.getGuildRoster(
      accessToken,
      guildRealmSlug,
      guildSlug
    );

  const membership = roster?.members?.find(
    (rosterMember) =>
      rosterMember.character?.name?.toLowerCase() ===
        member.name.toLowerCase() &&
      rosterMember.character?.realm
        ?.slug === guildRealmSlug
  );

  if (
    !membership ||
    typeof membership.rank !==
      "number" ||
    membership.rank >
      LEADERSHIP_RANK_THRESHOLD
  ) {
    throw new AppError(
      403,
      `${member.name} hat aktuell keinen Gildenleitungs-Rang.`
    );
  }
}
