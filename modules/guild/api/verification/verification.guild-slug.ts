const guildHrefPattern =
  /\/data\/wow\/guild\/[^/]+\/([^/?]+)/u;

export function extractGuildSlugFromHref(
  href: string | undefined
): string | null {
  if (!href) {
    return null;
  }

  const match =
    guildHrefPattern.exec(href);

  return match?.[1] ?? null;
}

/**
 * Blizzard slugs for both realms and guild names are almost always
 * just the lowercased, hyphenated display name — same heuristic as
 * `modules/guild/api/audit/audit.realm-slug.ts`, duplicated here
 * rather than shared since both are trivial and capability-local.
 */
export function slugify(
  value: string
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/'/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}
