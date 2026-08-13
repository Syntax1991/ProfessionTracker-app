/**
 * GuildMember only stores the realm display name (from manual entry or
 * the addon's GetRealmName()), not the Blizzard realm slug. Blizzard
 * slugs are almost always just the lowercased, hyphenated display
 * name, so this heuristic covers the common case. Realms with unusual
 * characters may not resolve; the audit skips those members instead
 * of failing the whole refresh.
 */
export function slugifyRealmName(
  realm: string
): string {
  return realm
    .toLowerCase()
    .trim()
    .replace(/'/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}
