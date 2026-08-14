export type RaiderLinkGuard = {
  getLinkedMember(
    token: string
  ): Promise<{ id: string } | null>;
};

export type LootTierStatusInput = {
  status: "PREFERRED" | "AVOID";
};

export type LootTrinketChoiceInput = {
  itemId: number;
};
