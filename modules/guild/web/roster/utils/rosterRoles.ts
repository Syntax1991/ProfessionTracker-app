export type RoleKey =
  | "TANK"
  | "HEALER"
  | "MELEE"
  | "RANGED"
  | "UNASSIGNED";

export const ROLE_ORDER: RoleKey[] = [
  "TANK",
  "HEALER",
  "MELEE",
  "RANGED",
  "UNASSIGNED"
];

export const ROLE_LABELS: Record<RoleKey, string> = {
  TANK: "Tanks",
  HEALER: "Healers",
  MELEE: "Melee DPS",
  RANGED: "Ranged DPS",
  UNASSIGNED: "Unassigned"
};

export function resolveRoleKey(
  role: string | null
): RoleKey {
  if (
    role === "TANK" ||
    role === "HEALER" ||
    role === "MELEE" ||
    role === "RANGED"
  ) {
    return role;
  }

  return "UNASSIGNED";
}

export type ArmorType =
  | "Cloth"
  | "Leather"
  | "Mail"
  | "Plate"
  | "Unknown";

const CLOTH_CLASSES = [
  "mage",
  "priest",
  "warlock"
];

const LEATHER_CLASSES = [
  "druid",
  "rogue",
  "demon hunter",
  "monk"
];

const MAIL_CLASSES = [
  "hunter",
  "shaman",
  "evoker"
];

const PLATE_CLASSES = [
  "warrior",
  "paladin",
  "death knight"
];

export function resolveArmorType(
  className: string
): ArmorType {
  const normalized =
    className.trim().toLowerCase();

  if (CLOTH_CLASSES.includes(normalized)) {
    return "Cloth";
  }

  if (LEATHER_CLASSES.includes(normalized)) {
    return "Leather";
  }

  if (MAIL_CLASSES.includes(normalized)) {
    return "Mail";
  }

  if (PLATE_CLASSES.includes(normalized)) {
    return "Plate";
  }

  return "Unknown";
}

export const ARMOR_TYPE_ORDER: ArmorType[] = [
  "Plate",
  "Mail",
  "Leather",
  "Cloth",
  "Unknown"
];
