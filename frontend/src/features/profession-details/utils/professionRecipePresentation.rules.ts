export type ProfessionRecipePresentationRule = {
  label: string;
  aliases: string[];
};

export const professionRecipeFamilyRules:
  ProfessionRecipePresentationRule[] = [
    {
      label: "Cloth",
      aliases: [
        "cloth equipment",
        "cloth armor"
      ]
    },
    {
      label: "Leather",
      aliases: [
        "leather equipment",
        "leather armor"
      ]
    },
    {
      label: "Mail",
      aliases: [
        "mail equipment",
        "mail armor"
      ]
    },
    {
      label: "Plate",
      aliases: [
        "plate equipment",
        "plate armor"
      ]
    }
  ];

export const professionRecipeSlotNames:
  Record<string, string> = {
    HEAD: "Head",
    NECK: "Neck",
    SHOULDER: "Shoulder",
    BACK: "Back",
    CHEST: "Chest",
    WRIST: "Wrist",
    HANDS: "Hands",
    WAIST: "Waist",
    LEGS: "Legs",
    FEET: "Feet",
    FINGER: "Ring",
    TRINKET: "Trinket",
    ONE_HAND: "One-Hand Weapon",
    MAIN_HAND: "Main Hand",
    OFF_HAND: "Off Hand",
    TWO_HAND: "Two-Hand",
    RANGED: "Ranged",
    PROFESSION_TOOL:
      "Profession Tool",
    PROFESSION_ACCESSORY:
      "Profession Accessory"
  };

export const professionRecipeNameSlotRules:
  ProfessionRecipePresentationRule[] = [
    {
      label: "Head",
      aliases: [
        "head",
        "helm",
        "helmet",
        "hood",
        "hat",
        "visor",
        "optics",
        "goggles"
      ]
    },
    {
      label: "Shoulder",
      aliases: [
        "shoulder",
        "shoulders",
        "pauldron",
        "pauldrons",
        "spaulder",
        "spaulders"
      ]
    },
    {
      label: "Chest",
      aliases: [
        "chest",
        "chestplate",
        "breastplate",
        "robe",
        "tunic",
        "vest"
      ]
    },
    {
      label: "Wrist",
      aliases: [
        "wrist",
        "bracer",
        "bracers",
        "vambrace",
        "vambraces",
        "binding",
        "bindings",
        "band",
        "bands"
      ]
    },
    {
      label: "Hands",
      aliases: [
        "hand",
        "hands",
        "glove",
        "gloves",
        "gauntlet",
        "gauntlets",
        "grip",
        "grips"
      ]
    },
    {
      label: "Waist",
      aliases: [
        "waist",
        "belt",
        "belts",
        "girdle",
        "girdles"
      ]
    },
    {
      label: "Legs",
      aliases: [
        "leg",
        "legs",
        "legging",
        "leggings",
        "legguard",
        "legguards",
        "legplate",
        "legplates",
        "pants",
        "trousers",
        "greaves"
      ]
    },
    {
      label: "Feet",
      aliases: [
        "feet",
        "foot",
        "boot",
        "boots",
        "shoe",
        "shoes",
        "sabaton",
        "sabatons",
        "footlink",
        "footlinks"
      ]
    },
    {
      label: "Back",
      aliases: [
        "back",
        "cloak",
        "cloaks",
        "cape",
        "capes"
      ]
    },
    {
      label: "Neck",
      aliases: [
        "neck",
        "necklace",
        "necklaces",
        "amulet",
        "amulets"
      ]
    },
    {
      label: "Ring",
      aliases: [
        "ring",
        "rings"
      ]
    }
  ];