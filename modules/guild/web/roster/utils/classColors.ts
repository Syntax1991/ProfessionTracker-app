const CLASS_COLORS: Record<string, string> = {
  "death knight": "#C41F3B",
  "demon hunter": "#A330C9",
  druid: "#FF7D0A",
  evoker: "#33937F",
  hunter: "#AAD372",
  mage: "#3FC7EB",
  monk: "#00FF98",
  paladin: "#F58CBA",
  priest: "#E7E7E7",
  rogue: "#FFF569",
  shaman: "#0070DE",
  warlock: "#8788EE",
  warrior: "#C79C6E"
};

export function resolveClassColor(
  className: string
): string {
  const normalized = className
    .trim()
    .toLowerCase();

  return (
    CLASS_COLORS[normalized] ??
    "#9DA5B7"
  );
}
