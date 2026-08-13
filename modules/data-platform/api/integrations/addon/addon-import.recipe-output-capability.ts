export type RecipeOutputSlot = {
  key: string;
  name: string;
};

const outputSlots:
  Record<
    string,
    RecipeOutputSlot
  > = {
    INVTYPE_HEAD: {
      key: "HEAD",
      name: "Head"
    },

    INVTYPE_NECK: {
      key: "NECK",
      name: "Neck"
    },

    INVTYPE_SHOULDER: {
      key: "SHOULDER",
      name: "Shoulder"
    },

    INVTYPE_CLOAK: {
      key: "BACK",
      name: "Back"
    },

    INVTYPE_CHEST: {
      key: "CHEST",
      name: "Chest"
    },

    INVTYPE_ROBE: {
      key: "CHEST",
      name: "Chest"
    },

    INVTYPE_WRIST: {
      key: "WRIST",
      name: "Wrist"
    },

    INVTYPE_HAND: {
      key: "HANDS",
      name: "Hands"
    },

    INVTYPE_WAIST: {
      key: "WAIST",
      name: "Waist"
    },

    INVTYPE_LEGS: {
      key: "LEGS",
      name: "Legs"
    },

    INVTYPE_FEET: {
      key: "FEET",
      name: "Feet"
    },

    INVTYPE_FINGER: {
      key: "FINGER",
      name: "Ring"
    },

    INVTYPE_TRINKET: {
      key: "TRINKET",
      name: "Trinket"
    },

    INVTYPE_WEAPON: {
      key: "ONE_HAND",
      name: "One-Hand Weapon"
    },

    INVTYPE_WEAPONMAINHAND: {
      key: "MAIN_HAND",
      name: "Main Hand"
    },

    INVTYPE_WEAPONOFFHAND: {
      key: "OFF_HAND",
      name: "Off Hand"
    },

    INVTYPE_2HWEAPON: {
      key: "TWO_HAND",
      name: "Two-Hand"
    },

    INVTYPE_SHIELD: {
      key: "OFF_HAND",
      name: "Shield"
    },

    INVTYPE_HOLDABLE: {
      key: "OFF_HAND",
      name: "Off Hand"
    },

    INVTYPE_RANGED: {
      key: "RANGED",
      name: "Ranged"
    },

    INVTYPE_RANGEDRIGHT: {
      key: "RANGED",
      name: "Ranged"
    },

    INVTYPE_PROFESSION_TOOL: {
      key: "PROFESSION_TOOL",
      name: "Profession Tool"
    },

    INVTYPE_PROFESSION_GEAR: {
      key: "PROFESSION_ACCESSORY",
      name: "Profession Accessory"
    }
  };

const equipmentFamilies = [
  {
    key: "CLOTH",
    name: "Cloth",
    aliases: [
      "cloth equipment",
      "cloth armor"
    ]
  },
  {
    key: "LEATHER",
    name: "Leather",
    aliases: [
      "leather equipment",
      "leather armor"
    ]
  },
  {
    key: "MAIL",
    name: "Mail",
    aliases: [
      "mail equipment",
      "mail armor"
    ]
  },
  {
    key: "PLATE",
    name: "Plate",
    aliases: [
      "plate equipment",
      "plate armor"
    ]
  }
] as const;

export function resolveRecipeOutputSlot(
  equipLoc: string | null
): RecipeOutputSlot | null {
  if (!equipLoc) {
    return null;
  }

  return (
    outputSlots[
      equipLoc
    ] ??
    null
  );
}

export function resolveRecipeEquipmentFamily(
  categoryName: string | null
): {
  key: string;
  name: string;
} | null {
  if (!categoryName) {
    return null;
  }

  const normalized =
    categoryName
      .trim()
      .toLocaleLowerCase(
        "en"
      );

  const definition =
    equipmentFamilies.find(
      (family) =>
        family.aliases.some(
          (alias) =>
            normalized === alias ||
            normalized.includes(
              alias
            )
        )
    );

  return definition
    ? {
        key:
          definition.key,
        name:
          definition.name
      }
    : null;
}