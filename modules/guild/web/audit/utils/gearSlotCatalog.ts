export type GearSlotColumn = {
  key: string;
  label: string;
  sortOrder: number;
};

export const gearSlotColumns: GearSlotColumn[] = [
  { key: "HEAD", label: "Head", sortOrder: 10 },
  { key: "NECK", label: "Neck", sortOrder: 20 },
  { key: "SHOULDER", label: "Shoulder", sortOrder: 30 },
  { key: "BACK", label: "Back", sortOrder: 40 },
  { key: "CHEST", label: "Chest", sortOrder: 50 },
  { key: "WRIST", label: "Wrist", sortOrder: 60 },
  { key: "HANDS", label: "Hands", sortOrder: 70 },
  { key: "WAIST", label: "Waist", sortOrder: 80 },
  { key: "LEGS", label: "Legs", sortOrder: 90 },
  { key: "FEET", label: "Feet", sortOrder: 100 },
  { key: "FINGER_1", label: "Ring 1", sortOrder: 110 },
  { key: "FINGER_2", label: "Ring 2", sortOrder: 120 },
  { key: "TRINKET_1", label: "Trinket 1", sortOrder: 130 },
  { key: "TRINKET_2", label: "Trinket 2", sortOrder: 140 },
  { key: "MAIN_HAND", label: "Main Hand", sortOrder: 150 },
  { key: "OFF_HAND", label: "Off Hand", sortOrder: 160 }
];
