export type LootTierStatus = "PREFERRED" | "AVOID";

export type LootTierPreference = {
  id: string;
  memberId: string;
  tierSlot: string;
  status: LootTierStatus;
  createdAt: string;
  updatedAt: string;
};

export type LootTrinketChoice = {
  id: string;
  memberId: string;
  rank: number;
  itemId: number;
  createdAt: string;
  updatedAt: string;
};

export type MyWishlist = {
  memberId: string;
  tierPreferences: LootTierPreference[];
  trinketChoices: LootTrinketChoice[];
};
