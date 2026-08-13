export const gearSlotKeys = [
  "HEAD",
  "NECK",
  "SHOULDER",
  "BACK",
  "CHEST",
  "WRIST",
  "HANDS",
  "WAIST",
  "LEGS",
  "FEET",
  "FINGER_1",
  "FINGER_2",
  "TRINKET_1",
  "TRINKET_2",
  "MAIN_HAND",
  "OFF_HAND"
] as const;

export const enchantStatuses = [
  "NOT_APPLICABLE",
  "MISSING",
  "READY"
] as const;

export type GearSlotKey =
  (typeof gearSlotKeys)[number];

export type EnchantStatus =
  (typeof enchantStatuses)[number];

export type GearSlotInput = {
  itemName: string;
  itemLevel?: number | undefined;
  enchantStatus: EnchantStatus;
  enchantName?: string | undefined;
  socketCount: number;
  gemCount: number;
  notes?: string | undefined;
};

export type GearSlotDefinition = {
  key: GearSlotKey;
  label: string;
  category: "ARMOR" | "ACCESSORIES" | "WEAPONS";
  sortOrder: number;
  supportsEnchant: boolean;
};
