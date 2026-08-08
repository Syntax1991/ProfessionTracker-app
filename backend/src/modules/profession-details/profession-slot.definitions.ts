export type ProfessionSlotKey =
  | "HEAD"
  | "NECK"
  | "SHOULDER"
  | "BACK"
  | "CHEST"
  | "WRIST"
  | "HANDS"
  | "WAIST"
  | "LEGS"
  | "FEET"
  | "FINGER"
  | "TRINKET"
  | "MAIN_HAND"
  | "OFF_HAND"
  | "TWO_HAND";

export type ProfessionSlot = {
  key: ProfessionSlotKey;
  name: string;
  order: number;
};

export type ProfessionSlotDefinition =
  ProfessionSlot & {
    aliases: string[];
  };

export const professionSlotDefinitions:
  ProfessionSlotDefinition[] = [
    {
      key: "HEAD",
      name: "Head",
      order: 10,
      aliases: [
        "head",
        "headgear",
        "helm",
        "helms",
        "helmet",
        "helmets",
        "hat",
        "hats",
        "hood",
        "hoods",
        "goggles",
        "kopf",
        "helme",
        "hut",
        "hute"
      ]
    },
    {
      key: "NECK",
      name: "Neck",
      order: 20,
      aliases: [
        "neck",
        "necklace",
        "necklaces",
        "amulet",
        "amulets",
        "hals",
        "halskette",
        "halsketten"
      ]
    },
    {
      key: "SHOULDER",
      name: "Shoulder",
      order: 30,
      aliases: [
        "shoulder",
        "shoulders",
        "pauldron",
        "pauldrons",
        "spaulder",
        "spaulders",
        "schulter",
        "schultern",
        "schulterstuck",
        "schulterstucke"
      ]
    },
    {
      key: "BACK",
      name: "Back",
      order: 40,
      aliases: [
        "back",
        "cloak",
        "cloaks",
        "cape",
        "capes",
        "umhang",
        "umhange"
      ]
    },
    {
      key: "CHEST",
      name: "Chest",
      order: 50,
      aliases: [
        "chest",
        "chestpiece",
        "chestpieces",
        "chestguard",
        "chestguards",
        "chestplate",
        "chestplates",
        "breastplate",
        "breastplates",
        "robe",
        "robes",
        "tunic",
        "tunics",
        "vest",
        "vests",
        "brust",
        "brustplatte",
        "brustplatten"
      ]
    },
    {
      key: "WRIST",
      name: "Wrist",
      order: 60,
      aliases: [
        "wrist",
        "wrists",
        "bracer",
        "bracers",
        "vambrace",
        "vambraces",
        "wristguard",
        "wristguards",
        "armschiene",
        "armschienen"
      ]
    },
    {
      key: "HANDS",
      name: "Hands",
      order: 70,
      aliases: [
        "hand",
        "hands",
        "glove",
        "gloves",
        "gauntlet",
        "gauntlets",
        "handschuh",
        "handschuhe"
      ]
    },
    {
      key: "WAIST",
      name: "Waist",
      order: 80,
      aliases: [
        "waist",
        "belt",
        "belts",
        "girdle",
        "girdles",
        "gurtel"
      ]
    },
    {
      key: "LEGS",
      name: "Legs",
      order: 90,
      aliases: [
        "leg",
        "legs",
        "legging",
        "leggings",
        "trouser",
        "trousers",
        "pants",
        "legplate",
        "legplates",
        "legguard",
        "legguards",
        "greaves",
        "beine",
        "hose",
        "hosen"
      ]
    },
    {
      key: "FEET",
      name: "Feet",
      order: 100,
      aliases: [
        "feet",
        "foot",
        "boot",
        "boots",
        "shoe",
        "shoes",
        "sabaton",
        "sabatons",
        "stiefel",
        "schuh",
        "schuhe"
      ]
    },
    {
      key: "FINGER",
      name: "Finger",
      order: 110,
      aliases: [
        "finger",
        "ring",
        "rings",
        "ringe"
      ]
    },
    {
      key: "TRINKET",
      name: "Trinket",
      order: 120,
      aliases: [
        "trinket",
        "trinkets"
      ]
    },
    {
      key: "MAIN_HAND",
      name: "Main Hand",
      order: 130,
      aliases: [
        "main hand",
        "mainhand",
        "one hand",
        "one handed",
        "1h",
        "einhand",
        "einhandig"
      ]
    },
    {
      key: "OFF_HAND",
      name: "Off Hand",
      order: 140,
      aliases: [
        "off hand",
        "offhand",
        "shield",
        "shields",
        "focus",
        "foci",
        "tome",
        "tomes",
        "schild",
        "schilde"
      ]
    },
    {
      key: "TWO_HAND",
      name: "Two-Hand",
      order: 150,
      aliases: [
        "two hand",
        "two handed",
        "2h",
        "zweihand",
        "zweihandig"
      ]
    }
  ];