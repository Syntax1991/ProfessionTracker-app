import type { GearSlotDefinition } from "./gear-readiness.types.js";

export const gearSlotCatalog:
  GearSlotDefinition[] = [
    { key: "HEAD", label: "Head", category: "ARMOR", sortOrder: 10, supportsEnchant: false },
    { key: "NECK", label: "Neck", category: "ARMOR", sortOrder: 20, supportsEnchant: false },
    { key: "SHOULDER", label: "Shoulder", category: "ARMOR", sortOrder: 30, supportsEnchant: false },
    { key: "BACK", label: "Back", category: "ARMOR", sortOrder: 40, supportsEnchant: true },
    { key: "CHEST", label: "Chest", category: "ARMOR", sortOrder: 50, supportsEnchant: true },
    { key: "WRIST", label: "Wrist", category: "ARMOR", sortOrder: 60, supportsEnchant: true },
    { key: "HANDS", label: "Hands", category: "ARMOR", sortOrder: 70, supportsEnchant: false },
    { key: "WAIST", label: "Waist", category: "ARMOR", sortOrder: 80, supportsEnchant: false },
    { key: "LEGS", label: "Legs", category: "ARMOR", sortOrder: 90, supportsEnchant: true },
    { key: "FEET", label: "Feet", category: "ARMOR", sortOrder: 100, supportsEnchant: true },
    { key: "FINGER_1", label: "Ring 1", category: "ACCESSORIES", sortOrder: 110, supportsEnchant: true },
    { key: "FINGER_2", label: "Ring 2", category: "ACCESSORIES", sortOrder: 120, supportsEnchant: true },
    { key: "TRINKET_1", label: "Trinket 1", category: "ACCESSORIES", sortOrder: 130, supportsEnchant: false },
    { key: "TRINKET_2", label: "Trinket 2", category: "ACCESSORIES", sortOrder: 140, supportsEnchant: false },
    { key: "MAIN_HAND", label: "Main Hand", category: "WEAPONS", sortOrder: 150, supportsEnchant: true },
    { key: "OFF_HAND", label: "Off Hand", category: "WEAPONS", sortOrder: 160, supportsEnchant: true }
  ];

export function findGearSlotDefinition(
  slotKey: string
) {
  return gearSlotCatalog.find(
    (definition) =>
      definition.key === slotKey
  );
}
