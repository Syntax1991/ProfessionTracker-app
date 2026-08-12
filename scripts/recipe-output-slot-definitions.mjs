export const equipLocLabels = {
  INVTYPE_HEAD: "Head",
  INVTYPE_NECK: "Neck",
  INVTYPE_SHOULDER: "Shoulder",
  INVTYPE_CLOAK: "Back",
  INVTYPE_CHEST: "Chest",
  INVTYPE_ROBE: "Chest",
  INVTYPE_WRIST: "Wrist",
  INVTYPE_HAND: "Hands",
  INVTYPE_WAIST: "Waist",
  INVTYPE_LEGS: "Legs",
  INVTYPE_FEET: "Feet",
  INVTYPE_FINGER: "Ring",
  INVTYPE_TRINKET: "Trinket",
  INVTYPE_WEAPON:
    "One-Hand Weapon",
  INVTYPE_WEAPONMAINHAND:
    "Main Hand",
  INVTYPE_WEAPONOFFHAND:
    "Off Hand",
  INVTYPE_2HWEAPON:
    "Two-Hand",
  INVTYPE_SHIELD:
    "Shield",
  INVTYPE_HOLDABLE:
    "Off Hand",
  INVTYPE_RANGED:
    "Ranged",
  INVTYPE_RANGEDRIGHT:
    "Ranged",
  INVTYPE_PROFESSION_TOOL:
    "Profession Tool",
  INVTYPE_PROFESSION_GEAR:
    "Profession Accessory"
};

export const familyDefinitions = [
  {
    name: "Cloth",
    aliases: [
      "cloth equipment",
      "cloth armor"
    ]
  },
  {
    name: "Leather",
    aliases: [
      "leather equipment",
      "leather armor"
    ]
  },
  {
    name: "Mail",
    aliases: [
      "mail equipment",
      "mail armor"
    ]
  },
  {
    name: "Plate",
    aliases: [
      "plate equipment",
      "plate armor"
    ]
  }
];

function normalize(
  value
) {
  return typeof value ===
    "string"
    ? value
        .trim()
        .toLocaleLowerCase(
          "en"
        )
    : "";
}

export function resolveOutputFamily(
  categoryName,
  parentCategoryName
) {
  const categories = [
    categoryName,
    parentCategoryName
  ]
    .map(
      normalize
    )
    .filter(
      Boolean
    );

  for (
    const definition of
    familyDefinitions
  ) {
    const matches =
      categories.some(
        (category) =>
          definition.aliases.some(
            (alias) =>
              category === alias ||
              category.includes(
                alias
              )
          )
      );

    if (matches) {
      return definition.name;
    }
  }

  return null;
}

export function resolveEquipLocLabel(
  equipLoc
) {
  if (!equipLoc) {
    return null;
  }

  return (
    equipLocLabels[
      equipLoc
    ] ??
    null
  );
}