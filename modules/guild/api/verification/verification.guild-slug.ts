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
