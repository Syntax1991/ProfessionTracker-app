const professionKeyByBattleNetId = new Map<number, string>([
  [164, "blacksmithing"],
  [165, "leatherworking"],
  [171, "alchemy"],
  [182, "herbalism"],
  [186, "mining"],
  [197, "tailoring"],
  [202, "engineering"],
  [333, "enchanting"],
  [393, "skinning"],
  [755, "jewelcrafting"],
  [773, "inscription"]
]);

export function getProfessionKeyByBattleNetId(
  professionId: number
): string | null {
  return (
    professionKeyByBattleNetId.get(professionId) ??
    null
  );
}