/**
 * Real per-boss ability catalog for The Venomous Abyss (Midnight
 * Season 2), pulled directly from Blizzard's own Game Data API
 * (journal-instance 1320, journal-encounter per boss) — not scraped
 * guide text, not invented. Each boss's top-level named mechanics
 * (depth-1 sections within each fight stage, deduped across the whole
 * encounter) are kept, grouped by the stage/phase title Blizzard's own
 * encounter journal uses. Deliberately does NOT include exact cast
 * timestamps — the journal doesn't expose them, and PTR-era timing
 * data isn't stable enough to bake in as fact (see
 * modules/raid/README.md's Cooldown Planning section). This is a
 * read-only reference legend for the timeline UI, not an auto-placed
 * schedule.
 */

export type BossAbility = {
  name: string;
  phase: string;
  sortOrder: number;
};

export type BossAbilityCatalogEntry = {
  bossName: string;
  abilities: BossAbility[];
};

const sszorakAbilities: BossAbility[] = [
  { name: "Dig In", phase: "Howling Maelstrom", sortOrder: 0 },
  { name: "Unbound Ferocity", phase: "Serpent's Fury", sortOrder: 1 },
  { name: "To the Slaughter", phase: "Serpent's Fury", sortOrder: 2 },
  { name: "Ravage", phase: "Apex Predator", sortOrder: 3 },
  { name: "Mutilate", phase: "Apex Predator", sortOrder: 4 },
  { name: "Tempest", phase: "Apex Predator", sortOrder: 5 },
  { name: "Viscous Cyst", phase: "Venomous Surge", sortOrder: 6 },
  { name: "Caustic Claws", phase: "Venomous Surge", sortOrder: 7 },
  { name: "Turbulent Gusts", phase: "Raging Crosswinds", sortOrder: 8 }
];

const entombedSentinelsAbilities: BossAbility[] = [
  { name: "Shifting Protovenom", phase: "Vashnik the Malignant", sortOrder: 0 },
  { name: "Ula'tek's Dominance", phase: "The Entombed Sentinels", sortOrder: 1 },
  { name: "Mark of Acid", phase: "The Entombed Sentinels", sortOrder: 2 },
  { name: "Mark of Blood", phase: "The Entombed Sentinels", sortOrder: 3 },
  { name: "Living Venom", phase: "Breath of Ula'tek", sortOrder: 4 },
  { name: "Venom Coagulation", phase: "Breath of Ula'tek", sortOrder: 5 },
  { name: "Toxic Droplets", phase: "Breath of Ula'tek", sortOrder: 6 },
  { name: "Empowering Slam", phase: "Breath of Ula'tek", sortOrder: 7 },
  { name: "Blood Venom", phase: "Blood of Ula'tek", sortOrder: 8 },
  { name: "Blighted Blood", phase: "Blood of Ula'tek", sortOrder: 9 },
  { name: "Unstable Miasma", phase: "Blood of Ula'tek", sortOrder: 10 },
  { name: "Bloodvenom Injection", phase: "Blood of Ula'tek", sortOrder: 11 },
  { name: "Helical Toxins", phase: "Vitriolic Stasis", sortOrder: 12 }
];

const vashnikAbilities: BossAbility[] = [
  { name: "Malignant Totem", phase: "Imbibe", sortOrder: 0 },
  { name: "Fountain of Blood", phase: "Imbibe", sortOrder: 1 },
  { name: "Fountain of Shadow", phase: "Imbibe", sortOrder: 2 },
  { name: "Fountain of Flame", phase: "Imbibe", sortOrder: 3 },
  { name: "Toxic Vapor", phase: "Imbibe", sortOrder: 4 },
  { name: "Malignant Burst", phase: "Imbibe", sortOrder: 5 },
  { name: "Catalytic Bile", phase: "Malignant Catalyst", sortOrder: 6 },
  { name: "Plague Wave", phase: "Plague Froth", sortOrder: 7 },
  { name: "Siphoning Infection", phase: "Adaptive Infection", sortOrder: 8 },
  { name: "Exploding Infection", phase: "Adaptive Infection", sortOrder: 9 },
  { name: "Stygian Infection", phase: "Adaptive Infection", sortOrder: 10 }
];

const coiledAltarAbilities: BossAbility[] = [
  { name: "Fangs of the Coiled Altar", phase: "Stage One: Serpent's Bargain", sortOrder: 0 },
  { name: "Toxic Deluge", phase: "Stage One: Serpent's Bargain", sortOrder: 1 },
  { name: "Guillotine", phase: "Stage One: Serpent's Bargain", sortOrder: 2 },
  { name: "Sever", phase: "Stage One: Serpent's Bargain", sortOrder: 3 },
  { name: "Venomfang", phase: "Stage One: Serpent's Bargain", sortOrder: 4 },
  { name: "Axegrinder", phase: "Stage One: Serpent's Bargain", sortOrder: 5 },
  { name: "Dreadmarch", phase: "Stage Two: Usurper's Reprisal", sortOrder: 6 },
  { name: "Soul Sever", phase: "Stage Two: Usurper's Reprisal", sortOrder: 7 },
  { name: "Eternal Nightfall", phase: "Stage Two: Usurper's Reprisal", sortOrder: 8 },
  { name: "Spiritcackle", phase: "Stage Two: Usurper's Reprisal", sortOrder: 9 },
  { name: "Gloombomb", phase: "Stage Two: Usurper's Reprisal", sortOrder: 10 },
  { name: "Dread Bolt", phase: "Stage Two: Usurper's Reprisal", sortOrder: 11 },
  { name: "Dreadful Presence", phase: "Stage Two: Usurper's Reprisal", sortOrder: 12 },
  { name: "Soulbinding", phase: "Intermission: The Claimed Vessel", sortOrder: 13 },
  { name: "Deathguard", phase: "Intermission: The Claimed Vessel", sortOrder: 14 },
  { name: "Soulbound", phase: "Stage Three: Coiled Union", sortOrder: 15 },
  { name: "Zul'jan", phase: "Stage Three: Coiled Union", sortOrder: 16 },
  { name: "Hex Lord Malacrass", phase: "Stage Three: Coiled Union", sortOrder: 17 }
];

const twinFangsAbilities: BossAbility[] = [
  { name: "Caustic Deluge", phase: "Vexhul", sortOrder: 0 },
  { name: "Venomous Emergence", phase: "Vexhul", sortOrder: 1 },
  { name: "Stir the Depths", phase: "Vexhul", sortOrder: 2 },
  { name: "Vile Flood", phase: "Vexhul", sortOrder: 3 },
  { name: "Concentrated Spittle", phase: "Vexhul", sortOrder: 4 },
  { name: "Blood Torrent", phase: "Ithraz", sortOrder: 5 },
  { name: "Rouse the Brood", phase: "Ithraz", sortOrder: 6 },
  { name: "Ravenous Feast", phase: "Ithraz", sortOrder: 7 },
  { name: "Coiling Ichor", phase: "Ithraz", sortOrder: 8 },
  { name: "Stone Breaker", phase: "Ithraz", sortOrder: 9 },
  { name: "Sanguine Storm", phase: "Ithraz", sortOrder: 10 },
  { name: "Clotted Bolt", phase: "Ithraz", sortOrder: 11 },
  { name: "Noxious Slick", phase: "Submerge", sortOrder: 12 }
];

const nekzaliAbilities: BossAbility[] = [
  { name: "Soulcoil Well", phase: "Stage One: Soulcoiler Initiation", sortOrder: 0 },
  { name: "Soulcoil Ignition", phase: "Stage One: Soulcoiler Initiation", sortOrder: 1 },
  { name: "Essence Rend", phase: "Stage One: Soulcoiler Initiation", sortOrder: 2 },
  { name: "Restless Amani", phase: "Stage One: Soulcoiler Initiation", sortOrder: 3 },
  { name: "Possession Barrage", phase: "Stage One: Soulcoiler Initiation", sortOrder: 4 },
  { name: "Hollowing Strikes", phase: "Stage One: Soulcoiler Initiation", sortOrder: 5 },
  { name: "Echo of Jawae", phase: "Intermission: Ritual of Awakening", sortOrder: 6 },
  { name: "Grasping Depths", phase: "Intermission: Ritual of Awakening", sortOrder: 7 },
  { name: "Uncoiling", phase: "Stage Two: Uncoiling", sortOrder: 8 },
  { name: "Invoke", phase: "Stage Two: Uncoiling", sortOrder: 9 }
];

const lostExplorersAbilities: BossAbility[] = [
  { name: "Dark Whispers", phase: "Mor'zahi", sortOrder: 0 },
  { name: "Evil Eyes", phase: "Mor'zahi", sortOrder: 1 },
  { name: "Malevolent Presence", phase: "Mor'zahi", sortOrder: 2 },
  { name: "Fishy Feedback", phase: "Mor'zahi", sortOrder: 3 },
  { name: "Dark Unity", phase: "Mor'zahi", sortOrder: 4 },
  { name: "Final Ascension", phase: "Mor'zahi", sortOrder: 5 },
  { name: "Throw Junk", phase: "Trader Gebbo", sortOrder: 6 },
  { name: "Mushroom Toss", phase: "Trader Gebbo", sortOrder: 7 },
  { name: "Explosive Surprise", phase: "Trader Gebbo", sortOrder: 8 },
  { name: "Smashing Shovel", phase: "Trader Gebbo", sortOrder: 9 },
  { name: "Frostfire Volley", phase: "Scrollsage Iku", sortOrder: 10 },
  { name: "Blink Nova", phase: "Scrollsage Iku", sortOrder: 11 },
  { name: "Icebound Flames", phase: "Scrollsage Iku", sortOrder: 12 },
  { name: "Shredding Shards", phase: "Scrollsage Iku", sortOrder: 13 },
  { name: "Cataclysmic Invocation", phase: "Scrollsage Iku", sortOrder: 14 },
  { name: "United Defense", phase: "First Mate Nama", sortOrder: 15 },
  { name: "Mighty Thud", phase: "First Mate Nama", sortOrder: 16 },
  { name: "Shell Spin", phase: "First Mate Nama", sortOrder: 17 },
  { name: "Steady Strikes", phase: "First Mate Nama", sortOrder: 18 },
  { name: "Relentless Escalation", phase: "First Mate Nama", sortOrder: 19 }
];

const ulatekAbilities: BossAbility[] = [
  { name: "Malignant Shell", phase: "Blightscale Spawn", sortOrder: 0 },
  { name: "Putrid Membrane", phase: "Blightscale Spawn", sortOrder: 1 },
  { name: "Blightscale Rawling", phase: "Blightscale Spawn", sortOrder: 2 },
  { name: "Blightscale Viper", phase: "Blightscale Spawn", sortOrder: 3 },
  { name: "Hardened", phase: "Blightscale Spawn", sortOrder: 4 },
  { name: "Noxious Shell", phase: "Blightscale Spawn", sortOrder: 5 },
  { name: "Toxic Womb", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 6 },
  { name: "Toxic Incubation", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 7 },
  { name: "Caustic Waves", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 8 },
  { name: "Call of the Serpent", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 9 },
  { name: "Mother's Wrath", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 10 },
  { name: "Gore Rattle", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 11 },
  { name: "Necrotic Vapors", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 12 },
  { name: "Ula'tek's Bond", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 13 },
  { name: "Rage of the Shackled", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 14 },
  { name: "Unchecked Rage", phase: "Stage One: Fury of the Serpent Mother", sortOrder: 15 },
  { name: "Doomscale Egg", phase: "Stage Two: Children of the Doomscale", sortOrder: 16 },
  { name: "Doomscale Warden", phase: "Stage Two: Children of the Doomscale", sortOrder: 17 },
  { name: "Doomscale Cauldron", phase: "Stage Two: Children of the Doomscale", sortOrder: 18 },
  { name: "Blightscale Clutch", phase: "Stage Two: Children of the Doomscale", sortOrder: 19 },
  { name: "Virulent Spit", phase: "Stage Two: Children of the Doomscale", sortOrder: 20 },
  { name: "Spectral Coils", phase: "Intermission: The Shattering", sortOrder: 21 },
  { name: "Circling Prey", phase: "Stage Three: Ula'tek's Ascension", sortOrder: 22 },
  { name: "Serpent's Bite", phase: "Stage Three: Ula'tek's Ascension", sortOrder: 23 },
  { name: "Fury Unleashed", phase: "Stage Three: Ula'tek's Ascension", sortOrder: 24 }
];

export const bossAbilityCatalog: BossAbilityCatalogEntry[] = [
  { bossName: "Sszorak", abilities: sszorakAbilities },
  { bossName: "Entombed Sentinels", abilities: entombedSentinelsAbilities },
  { bossName: "Vashnik the Malignant", abilities: vashnikAbilities },
  { bossName: "The Coiled Altar", abilities: coiledAltarAbilities },
  { bossName: "The Twin Fangs", abilities: twinFangsAbilities },
  { bossName: "Nek'zali the Soulcoiler", abilities: nekzaliAbilities },
  { bossName: "The Lost Explorers", abilities: lostExplorersAbilities },
  { bossName: "Ula'tek", abilities: ulatekAbilities }
];

export function getAbilitiesForBoss(
  bossName: string
): BossAbility[] {
  return (
    bossAbilityCatalog.find(
      (entry) =>
        entry.bossName === bossName
    )?.abilities ?? []
  );
}

export function groupAbilitiesByPhase(
  abilities: BossAbility[]
): Array<{ phase: string; abilities: BossAbility[] }> {
  const order: string[] = [];
  const byPhase = new Map<string, BossAbility[]>();

  for (const ability of abilities) {
    if (!byPhase.has(ability.phase)) {
      byPhase.set(ability.phase, []);
      order.push(ability.phase);
    }

    byPhase.get(ability.phase)?.push(ability);
  }

  return order.map((phase) => ({
    phase,
    abilities: byPhase.get(phase) ?? []
  }));
}
