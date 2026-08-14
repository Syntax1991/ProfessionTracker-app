/**
 * Real loot table for Midnight Season 2's raid, "The Venomous
 * Abyss" (researched via Wowhead-derived guides, cross-checked
 * against a WoWAudit reference screenshot of the same raid's item
 * slots/sources — not guessed). Item slot strings match Blizzard's
 * own equipped-item vocabulary (see `enchantableSlotTypes` in
 * `modules/guild/api/audit/audit.stats.ts`). `tierSlot` is set only
 * on tier-token items; Ula'tek's flexible token uses "ANY" since it
 * can be exchanged for any of the five tier slots rather than being
 * tied to one. `id` is a stable local slug — not a real Blizzard
 * item id, since bulk-resolving ~100 real ids wasn't feasible from
 * the sources available; real ids should be backfilled once Step 3
 * (sim upload) needs to match parsed report items against this
 * catalog.
 */

export type LootCatalogItem = {
  id: string;
  name: string;
  slot: string;
  bossName: string;
  tierSlot: string | null;
};

export type LootCatalogRaid = {
  raidKey: string;
  items: LootCatalogItem[];
};

const items: LootCatalogItem[] = [
  { id: "crown-of-the-eternal-fang", name: "Crown of the Eternal Fang", slot: "HEAD", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "soulslither-spaulders", name: "Soulslither Spaulders", slot: "SHOULDER", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "vestment-of-the-awakening", name: "Vestment of the Awakening", slot: "CHEST", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "restless-spirit-shackles", name: "Restless Spirit Shackles", slot: "WRIST", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "cursed-reliquary-cincture", name: "Cursed Reliquary Cincture", slot: "WAIST", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "initiates-sacrificial-tights", name: "Initiate's Sacrificial Tights", slot: "LEGS", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "skullguard-of-the-risen-sacrifice", name: "Skullguard of the Risen Sacrifice", slot: "FEET", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "strongbloods-ceremonial-cleaver", name: "Strongblood's Ceremonial Cleaver", slot: "MAIN_HAND", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "hexing-spiritrender", name: "Hexing Spiritrender", slot: "MAIN_HAND", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "tomb-creepers-claw", name: "Tomb Creeper's Claw", slot: "MAIN_HAND", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "bubblefin-splash-guard", name: "Bubblefin Splash Guard", slot: "OFF_HAND", bossName: "Nek'zali the Soulcoiler", tierSlot: null },
  { id: "frostscales-mystic-frond", name: "Frostscale's Mystic Frond", slot: "OFF_HAND", bossName: "Nek'zali the Soulcoiler", tierSlot: null },

  { id: "venom-singed-cuffs", name: "Venom-Singed Cuffs", slot: "WRIST", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "shadow-hunters-warmask", name: "Shadow Hunter's Warmask", slot: "HEAD", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "venom-wardens-greaves", name: "Venom Warden's Greaves", slot: "LEGS", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "ancient-constructs-venomshiv", name: "Ancient Construct's Venomshiv", slot: "MAIN_HAND", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "caustic-keeper-crusher", name: "Caustic Keeper Crusher", slot: "TWOHAND", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "spine-of-the-hissing-abyss", name: "Spine of the Hissing Abyss", slot: "OFF_HAND", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "sentinels-vitriolic-chain", name: "Sentinel's Vitriolic Chain", slot: "NECK", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "keepers-seething-core", name: "Keeper's Seething Core", slot: "TRINKET", bossName: "Entombed Sentinels", tierSlot: null },
  { id: "venomwoven-idol", name: "Venomwoven Idol", slot: "HANDS", bossName: "Entombed Sentinels", tierSlot: "GLOVES" },
  { id: "venomcured-idol", name: "Venomcured Idol", slot: "HANDS", bossName: "Entombed Sentinels", tierSlot: "GLOVES" },
  { id: "venomcast-idol", name: "Venomcast Idol", slot: "HANDS", bossName: "Entombed Sentinels", tierSlot: "GLOVES" },
  { id: "venomforged-idol", name: "Venomforged Idol", slot: "HANDS", bossName: "Entombed Sentinels", tierSlot: "GLOVES" },

  { id: "errant-scrollsages-hood", name: "Errant Scrollsage's Hood", slot: "HEAD", bossName: "The Lost Explorers", tierSlot: null },
  { id: "unpossessed-skullsash", name: "Unpossessed Skullsash", slot: "WAIST", bossName: "The Lost Explorers", tierSlot: null },
  { id: "shellbound-bracers", name: "Shellbound Bracers", slot: "WRIST", bossName: "The Lost Explorers", tierSlot: null },
  { id: "boots-of-the-reckless-wayfarer", name: "Boots of the Reckless Wayfarer", slot: "FEET", bossName: "The Lost Explorers", tierSlot: null },
  { id: "malevolent-spiritcudgel", name: "Malevolent Spiritcudgel", slot: "MAIN_HAND", bossName: "The Lost Explorers", tierSlot: null },
  { id: "gebbos-backup-blaster", name: "Gebbo's Backup Blaster", slot: "RANGED", bossName: "The Lost Explorers", tierSlot: null },
  { id: "venom-slashed-scuteward", name: "Venom-Slashed Scuteward", slot: "OFF_HAND", bossName: "The Lost Explorers", tierSlot: null },
  { id: "first-mates-shellward", name: "First Mate's Shellward", slot: "TRINKET", bossName: "The Lost Explorers", tierSlot: null },
  { id: "gebbos-bottomless-bag", name: "Gebbo's Bottomless Bag", slot: "TRINKET", bossName: "The Lost Explorers", tierSlot: null },
  { id: "venomwoven-remnant", name: "Venomwoven Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER" },
  { id: "venomcured-remnant", name: "Venomcured Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER" },
  { id: "venomcast-remnant", name: "Venomcast Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER" },
  { id: "venomforged-remnant", name: "Venomforged Remnant", slot: "SHOULDER", bossName: "The Lost Explorers", tierSlot: "SHOULDER" },

  { id: "frothing-venom-spaulders", name: "Frothing Venom Spaulders", slot: "SHOULDER", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "serpentine-mixing-belt", name: "Serpentine Mixing Belt", slot: "WAIST", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "scaled-fiends-warboots", name: "Scaled Fiend's Warboots", slot: "FEET", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "venomancers-winged-channeler", name: "Venomancer's Winged Channeler", slot: "TWOHAND", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "malignant-toothed-edge", name: "Malignant Toothed Edge", slot: "MAIN_HAND", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "vile-alchemists-band", name: "Vile Alchemist's Band", slot: "FINGER_1", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "vashniks-sanguine-rancor", name: "Vashnik's Sanguine Rancor", slot: "TRINKET", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "fang-of-umbral-malignance", name: "Fang of Umbral Malignance", slot: "TRINKET", bossName: "Vashnik the Malignant", tierSlot: null },
  { id: "venomwoven-icon", name: "Venomwoven Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST" },
  { id: "venomcured-icon", name: "Venomcured Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST" },
  { id: "venomcast-icon", name: "Venomcast Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST" },
  { id: "venomforged-icon", name: "Venomforged Icon", slot: "CHEST", bossName: "Vashnik the Malignant", tierSlot: "CHEST" },

  { id: "ruthless-slaughtergrips", name: "Ruthless Slaughtergrips", slot: "HANDS", bossName: "Sszorak", tierSlot: null },
  { id: "ferocious-scaleboots", name: "Ferocious Scaleboots", slot: "FEET", bossName: "Sszorak", tierSlot: null },
  { id: "caustic-chain-wrapped-sash", name: "Caustic Chain-Wrapped Sash", slot: "WAIST", bossName: "Sszorak", tierSlot: null },
  { id: "venomous-boneglaive", name: "Venomous Boneglaive", slot: "TWOHAND", bossName: "Sszorak", tierSlot: null },
  { id: "slithering-savages-gavel", name: "Slithering Savage's Gavel", slot: "MAIN_HAND", bossName: "Sszorak", tierSlot: null },
  { id: "apex-brutes-claw-ring", name: "Apex Brute's Claw Ring", slot: "FINGER_1", bossName: "Sszorak", tierSlot: null },
  { id: "sszoraks-ferocity", name: "Sszorak's Ferocity", slot: "TRINKET", bossName: "Sszorak", tierSlot: null },
  { id: "idol-of-the-howling-nexus", name: "Idol of the Howling Nexus", slot: "TRINKET", bossName: "Sszorak", tierSlot: null },
  { id: "venomwoven-relic", name: "Venomwoven Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS" },
  { id: "venomcured-relic", name: "Venomcured Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS" },
  { id: "venomcast-relic", name: "Venomcast Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS" },
  { id: "venomforged-relic", name: "Venomforged Relic", slot: "LEGS", bossName: "Sszorak", tierSlot: "LEGS" },

  { id: "ornaments-of-the-eternal-coil", name: "Ornaments of the Eternal Coil", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: null },
  { id: "ophidian-fangmail", name: "Ophidian Fangmail", slot: "CHEST", bossName: "The Twin Fangs", tierSlot: null },
  { id: "scaleplate-strangulators", name: "Scaleplate Strangulators", slot: "WRIST", bossName: "The Twin Fangs", tierSlot: null },
  { id: "bespittled-slitherslippers", name: "Bespittled Slitherslippers", slot: "FEET", bossName: "The Twin Fangs", tierSlot: null },
  { id: "ravenous-feasters-fang", name: "Ravenous Feaster's Fang", slot: "MAIN_HAND", bossName: "The Twin Fangs", tierSlot: null },
  { id: "amulet-of-the-twin-fangs", name: "Amulet of the Twin Fangs", slot: "NECK", bossName: "The Twin Fangs", tierSlot: null },
  { id: "preternatural-antivenom", name: "Preternatural Antivenom", slot: "TRINKET", bossName: "The Twin Fangs", tierSlot: null },
  { id: "vexhuls-everflowing-gland", name: "Vexhul's Everflowing Gland", slot: "TRINKET", bossName: "The Twin Fangs", tierSlot: null },
  { id: "venomwoven-effigy", name: "Venomwoven Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD" },
  { id: "venomcured-effigy", name: "Venomcured Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD" },
  { id: "venomcast-effigy", name: "Venomcast Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD" },
  { id: "venomforged-effigy", name: "Venomforged Effigy", slot: "HEAD", bossName: "The Twin Fangs", tierSlot: "HEAD" },

  { id: "grasps-of-the-eternal-shadow", name: "Grasps of the Eternal Shadow", slot: "HANDS", bossName: "The Coiled Altar", tierSlot: null },
  { id: "reckless-spirit-breastplate", name: "Reckless Spirit Breastplate", slot: "CHEST", bossName: "The Coiled Altar", tierSlot: null },
  { id: "coiled-hex-legguards", name: "Coiled Hex Legguards", slot: "LEGS", bossName: "The Coiled Altar", tierSlot: null },
  { id: "cuisses-of-the-uncoiled-union", name: "Cuisses of the Uncoiled Union", slot: "LEGS", bossName: "The Coiled Altar", tierSlot: null },
  { id: "girdle-of-toxic-regret", name: "Girdle of Toxic Regret", slot: "WAIST", bossName: "The Coiled Altar", tierSlot: null },
  { id: "cackling-soultreads", name: "Cackling Soultreads", slot: "FEET", bossName: "The Coiled Altar", tierSlot: null },
  { id: "sash-of-the-forlorn-vessel", name: "Sash of the Forlorn Vessel", slot: "WAIST", bossName: "The Coiled Altar", tierSlot: null },
  { id: "silken-voodoo-drape", name: "Silken Voodoo Drape", slot: "BACK", bossName: "The Coiled Altar", tierSlot: null },
  { id: "baleful-hexblade", name: "Baleful Hexblade", slot: "MAIN_HAND", bossName: "The Coiled Altar", tierSlot: null },
  { id: "amanmuso-warlords-vengeance", name: "Aman'muso, Warlord's Vengeance", slot: "TWOHAND", bossName: "The Coiled Altar", tierSlot: null },
  { id: "maze-roa-warlords-fury", name: "Maze-roa, Warlord's Fury", slot: "TWOHAND", bossName: "The Coiled Altar", tierSlot: null },
  { id: "hex-lords-dooming-idol", name: "Hex Lord's Dooming Idol", slot: "TRINKET", bossName: "The Coiled Altar", tierSlot: null },
  { id: "zuljins-guillotine-technique", name: "Zul'jin's Guillotine Technique", slot: "TRINKET", bossName: "The Coiled Altar", tierSlot: null },

  { id: "venomkeepers-horrific-cowl", name: "Venomkeeper's Horrific Cowl", slot: "HEAD", bossName: "Ula'tek", tierSlot: null },
  { id: "gaze-of-the-coiled-watcher", name: "Gaze of the Coiled Watcher", slot: "HEAD", bossName: "Ula'tek", tierSlot: null },
  { id: "awoken-dreadfang-cuirass", name: "Awoken Dreadfang Cuirass", slot: "CHEST", bossName: "Ula'tek", tierSlot: null },
  { id: "chausses-of-unbound-rancor", name: "Chausses of Unbound Rancor", slot: "LEGS", bossName: "Ula'tek", tierSlot: null },
  { id: "jaw-of-the-shackled-goddess", name: "Jaw of the Shackled Goddess", slot: "MAIN_HAND", bossName: "Ula'tek", tierSlot: null },
  { id: "abyssal-broodfiends-bardiche", name: "Abyssal Broodfiend's Bardiche", slot: "TWOHAND", bossName: "Ula'tek", tierSlot: null },
  { id: "caustic-repose-greatbow", name: "Caustic Repose Greatbow", slot: "RANGED", bossName: "Ula'tek", tierSlot: null },
  { id: "zathatek-breath-of-corruption", name: "Zatha'tek, Breath of Corruption", slot: "MAIN_HAND", bossName: "Ula'tek", tierSlot: null },
  { id: "janthrazet-the-soul-fang", name: "Jan'thrazet, the Soul Fang", slot: "MAIN_HAND", bossName: "Ula'tek", tierSlot: null },
  { id: "aqirbane-reliquary", name: "Aqirbane Reliquary", slot: "NECK", bossName: "Ula'tek", tierSlot: null },
  { id: "font-of-venomous-rage", name: "Font of Venomous Rage", slot: "TRINKET", bossName: "Ula'tek", tierSlot: null },
  { id: "voracious-heart-of-ulatek", name: "Voracious Heart of Ula'tek", slot: "TRINKET", bossName: "Ula'tek", tierSlot: null },
  { id: "slumbering-coil-curio", name: "Slumbering Coil Curio", slot: "MISCELLANEOUS", bossName: "Ula'tek", tierSlot: "ANY" }
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
