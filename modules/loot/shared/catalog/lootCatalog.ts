/**
 * Real loot table for Midnight Season 2's raid, "The Venomous
 * Abyss", pulled directly from Blizzard's own Game Data API —
 * `journal-instance`/`journal-encounter` (item list per boss) and
 * `/data/wow/item/{id}` (slot/quality/level per item), app-level
 * OAuth via `BATTLENET_CLIENT_ID`/`SECRET`. Not scraped, not
 * hand-typed from guide text (an earlier pass of this file was —
 * rebuilt once an API source was confirmed available; see the
 * `feedback_verify_data_availability` memory). `slot` uses
 * Blizzard's own `inventory_type` vocabulary as-is (`CLOAK` not
 * `BACK`, `HAND` not `HANDS`, `WEAPON`/`WEAPONMAINHAND`/`TWOHWEAPON`
 * distinct, etc.) except `ROBE` is normalized to `CHEST` since both
 * occupy the same equipment slot in-game. `tierSlot` is set only on
 * tier-token items (`itemClass "Miscellaneous"`/`itemSubclass
 * "Junk"` in Blizzard's own data — derived here from each token's
 * real name suffix: Idol→Gloves, Remnant→Shoulder, Icon→Chest,
 * Relic→Legs, Effigy→Head); Ula'tek's flexible "Slumbering Coil
 * Curio" uses `tierSlot: "ANY"`. Housing decor, companion pets and
 * the mythic mount that also drop from these encounters are
 * deliberately excluded — real loot, but not gear.
 */

export type LootCatalogItem = {
  itemId: number;
  name: string;
  slot: string;
  bossName: string;
  tierSlot: string | null;
  quality: string;
  itemLevel: number;
};

export type LootCatalogRaid = {
  raidKey: string;
  items: LootCatalogItem[];
};

const items: LootCatalogItem[] = [
  { itemId: 281227, name: "Soulcoiler's Rush'kah", slot: "HEAD", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "RARE", itemLevel: 1 },
  { itemId: 268230, name: "Crown of the Eternal Fang", slot: "HEAD", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270162, name: "Soulcoiler Ritual Vessel", slot: "TRINKET", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268203, name: "Hexing Spiritrender", slot: "WEAPON", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268236, name: "Initiate's Sacrificial Tights", slot: "LEGS", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268235, name: "Vestment of the Awakening", slot: "CHEST", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268229, name: "Skullguard of the Risen Sacrifice", slot: "HEAD", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268245, name: "Entombed Cultist's Sabatons", slot: "FEET", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268208, name: "Strongblood's Ceremonial Cleaver", slot: "WEAPON", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270930, name: "Tomb-Creeper's Claw", slot: "WEAPON", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268248, name: "Amani Summoning Shawl", slot: "CLOAK", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268218, name: "Nek'zali's Spiritwalkers", slot: "FEET", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268240, name: "Restless Spirit Shackles", slot: "WRIST", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268216, name: "Cursed Reliquary Cincture", slot: "WAIST", bossName: "Nek'zali the Soulcoiler", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270913, name: "Venomforged Idol", slot: "HAND", bossName: "Entombed Sentinels", tierSlot: "GLOVES", quality: "EPIC", itemLevel: 219 },
  { itemId: 270912, name: "Venomcast Idol", slot: "HAND", bossName: "Entombed Sentinels", tierSlot: "GLOVES", quality: "EPIC", itemLevel: 219 },
  { itemId: 270911, name: "Venomcured Idol", slot: "HAND", bossName: "Entombed Sentinels", tierSlot: "GLOVES", quality: "EPIC", itemLevel: 219 },
  { itemId: 270910, name: "Venomwoven Idol", slot: "HAND", bossName: "Entombed Sentinels", tierSlot: "GLOVES", quality: "EPIC", itemLevel: 219 },
  { itemId: 268250, name: "Sentinel's Vitriolic Chain", slot: "NECK", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270165, name: "Keeper's Seething Core", slot: "TRINKET", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268204, name: "Ancient Construct's Venomshiv", slot: "WEAPON", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268198, name: "Caustic Keeper-Crusher", slot: "TWOHWEAPON", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268224, name: "Venom Warden's Greaves", slot: "LEGS", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268228, name: "Venom-Singed Cuffs", slot: "WRIST", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268219, name: "Shadow Hunter's Warmask", slot: "HEAD", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268197, name: "Spine of the Hissing Abyss", slot: "HOLDABLE", bossName: "Entombed Sentinels", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270925, name: "Venomforged Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER", quality: "EPIC", itemLevel: 219 },
  { itemId: 270924, name: "Venomcast Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER", quality: "EPIC", itemLevel: 219 },
  { itemId: 270923, name: "Venomcured Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER", quality: "EPIC", itemLevel: 219 },
  { itemId: 270922, name: "Venomwoven Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER", quality: "EPIC", itemLevel: 219 },
  { itemId: 270164, name: "Gebbo's Bottomless Bag", slot: "TRINKET", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270160, name: "First Mate's Shellward", slot: "TRINKET", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268210, name: "Malevolent Spiritcudgel", slot: "WEAPON", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268200, name: "Gebbo's Backup Blaster", slot: "RANGEDRIGHT", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268227, name: "Unpossessed Skullsash", slot: "WAIST", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268242, name: "Errant Scrollsage's Hood", slot: "HEAD", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268258, name: "Boots of the Reckless Wayfarer", slot: "FEET", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268239, name: "Shellbound Bracers", slot: "WRIST", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268196, name: "Venom-Slashed Scuteward", slot: "SHIELD", bossName: "The Lost Explorers", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270929, name: "Venomforged Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST", quality: "EPIC", itemLevel: 219 },
  { itemId: 270928, name: "Venomcast Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST", quality: "EPIC", itemLevel: 219 },
  { itemId: 270927, name: "Venomcured Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST", quality: "EPIC", itemLevel: 219 },
  { itemId: 270926, name: "Venomwoven Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST", quality: "EPIC", itemLevel: 219 },
  { itemId: 268249, name: "Vile Alchemist's Band", slot: "FINGER", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268246, name: "Frothing Venom Spaulders", slot: "SHOULDER", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268254, name: "Serpentine Mixing Belt", slot: "WAIST", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268260, name: "Scaled Fiend's Warboots", slot: "FEET", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268214, name: "Malignant Toothed Edge", slot: "TWOHWEAPON", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270166, name: "Vashnik's Sanguine Rancor", slot: "TRINKET", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270161, name: "Fang of Umbral Malignance", slot: "TRINKET", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268205, name: "Venomancer's Winged Channeler", slot: "TWOHWEAPON", bossName: "Vashnik the Malignant", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270921, name: "Venomforged Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS", quality: "EPIC", itemLevel: 219 },
  { itemId: 270920, name: "Venomcast Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS", quality: "EPIC", itemLevel: 219 },
  { itemId: 270919, name: "Venomcured Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS", quality: "EPIC", itemLevel: 219 },
  { itemId: 270918, name: "Venomwoven Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS", quality: "EPIC", itemLevel: 219 },
  { itemId: 270163, name: "Sszorak's Ferocity", slot: "TRINKET", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270174, name: "Idol of the Howling Nexus", slot: "TRINKET", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268206, name: "Slithering Savage's Gavel", slot: "WEAPON", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268201, name: "Venomous Boneglaive", slot: "WEAPON", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268257, name: "Caustic Chain-Wrapped Sash", slot: "WAIST", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268234, name: "Ruthless Slaughtergrips", slot: "HAND", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268233, name: "Ferocious Scaleboots", slot: "FEET", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268252, name: "Apex Brute's Claw Ring", slot: "FINGER", bossName: "Sszorak", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270917, name: "Venomforged Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD", quality: "EPIC", itemLevel: 219 },
  { itemId: 270916, name: "Venomcast Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD", quality: "EPIC", itemLevel: 219 },
  { itemId: 270915, name: "Venomcured Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD", quality: "EPIC", itemLevel: 219 },
  { itemId: 270914, name: "Venomwoven Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD", quality: "EPIC", itemLevel: 219 },
  { itemId: 270171, name: "Preternatural Antivenom", slot: "TRINKET", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270170, name: "Vexhul's Everflowing Gland", slot: "TRINKET", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268251, name: "Amulet of the Twin Fangs", slot: "NECK", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268264, name: "Ravenous Feaster's Fang", slot: "WEAPON", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268241, name: "Ornaments of the Eternal Coil", slot: "SHOULDER", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268261, name: "Bespittled Slitherslippers", slot: "FEET", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268223, name: "Ophidian Fangmail", slot: "CHEST", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268220, name: "Scaleplate Strangulators", slot: "HAND", bossName: "The Twin Fangs", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268225, name: "Coiled Hex Legguards", slot: "LEGS", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268231, name: "Soulslither Spaulders", slot: "SHOULDER", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268209, name: "Aman'muso, Warlord's Vengeance", slot: "WEAPONMAINHAND", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270173, name: "Zul'jin's Guillotine Technique", slot: "TRINKET", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268243, name: "Grasps of the Eternal Shadow", slot: "HAND", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270169, name: "Hex Lord's Dooming Idol", slot: "TRINKET", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268237, name: "Cuisses of the Uncoiled Union", slot: "LEGS", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268222, name: "Reckless Spirit Breastplate", slot: "CHEST", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268213, name: "Maze-roa, Warlord's Fury", slot: "TWOHWEAPON", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268253, name: "Silken Voodoo Drape", slot: "CLOAK", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268255, name: "Cackling Soultreads", slot: "FEET", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268256, name: "Sash of the Forlorn Vessel", slot: "WAIST", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268259, name: "Girdle of Toxic Regret", slot: "WAIST", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268211, name: "Baleful Hexblade", slot: "WEAPON", bossName: "The Coiled Altar", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 275937, name: "Hex Lord's Visage", slot: "HEAD", bossName: "The Coiled Altar", tierSlot: null, quality: "RARE", itemLevel: 1 },
  { itemId: 275938, name: "Hex Lord's Gaze", slot: "HEAD", bossName: "The Coiled Altar", tierSlot: null, quality: "RARE", itemLevel: 1 },
  { itemId: 270909, name: "Slumbering Coil Curio", slot: "MISCELLANEOUS", bossName: "Ula'tek", tierSlot: "ANY", quality: "EPIC", itemLevel: 219 },
  { itemId: 268202, name: "Jaw of the Shackled Goddess", slot: "WEAPON", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268215, name: "Abyssal Broodfiend's Bardiche", slot: "TWOHWEAPON", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270168, name: "Font of Venomous Rage", slot: "TRINKET", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 270175, name: "Voracious Heart of Ula'tek", slot: "TRINKET", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268207, name: "Caustic Repose Greatbow", slot: "RANGED", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 268265, name: "Aqirbane Reliquary", slot: "NECK", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 271874, name: "Venomkeeper's Horrific Cowl", slot: "HEAD", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 271875, name: "Gaze of the Coiled Watcher", slot: "HEAD", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 271876, name: "Awoken Dreadfang Cuirass", slot: "CHEST", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 271878, name: "Chausses of Unbound Rancor", slot: "LEGS", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 271093, name: "Zatha'tek, Breath of Corruption", slot: "WEAPONMAINHAND", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 },
  { itemId: 271092, name: "Jan'thrazet, the Soul Fang", slot: "WEAPON", bossName: "Ula'tek", tierSlot: null, quality: "EPIC", itemLevel: 219 }
];

export const lootCatalog: LootCatalogRaid[] = [
  { raidKey: "MIDNIGHT_S2_VENOMOUS_ABYSS", items }
];

export function getLootCatalogForRaid(
  raidKey: string
): LootCatalogItem[] {
  return (
    lootCatalog.find(
      (raid) => raid.raidKey === raidKey
    )?.items ?? []
  );
}

export function groupLootByBoss(
  catalogItems: LootCatalogItem[]
): Array<{ bossName: string; items: LootCatalogItem[] }> {
  const order: string[] = [];
  const byBoss = new Map<string, LootCatalogItem[]>();

  for (const item of catalogItems) {
    if (!byBoss.has(item.bossName)) {
      byBoss.set(item.bossName, []);
      order.push(item.bossName);
    }

    byBoss.get(item.bossName)?.push(item);
  }

  return order.map((bossName) => ({
    bossName,
    items: byBoss.get(bossName) ?? []
  }));
}

export function groupLootBySlot(
  catalogItems: LootCatalogItem[]
): Array<{ slot: string; items: LootCatalogItem[] }> {
  const order: string[] = [];
  const bySlot = new Map<string, LootCatalogItem[]>();

  for (const item of catalogItems) {
    if (!bySlot.has(item.slot)) {
      bySlot.set(item.slot, []);
      order.push(item.slot);
    }

    bySlot.get(item.slot)?.push(item);
  }

  return order.map((slot) => ({
    slot,
    items: bySlot.get(slot) ?? []
  }));
}
