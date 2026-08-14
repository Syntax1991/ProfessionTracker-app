export type GuildMemberAuditStats = {
  averageItemLevel: number | null;
  missingEnchantSlots: number | null;
  totalSocketCount: number | null;
  filledSocketCount: number | null;
};

export type GuildAuditRefreshResult = {
  totalMembers: number;
  auditedMembers: number;
  skippedMembers: number;
};

export type GuildMemberGearSlotStats = {
  slotKey: string;
  itemName: string | null;
  itemLevel: number | null;
  quality: string | null;
  enchantStatus:
    | "READY"
    | "MISSING"
    | "NOT_APPLICABLE";
  socketCount: number;
  filledSocketCount: number;
  upgradeCurrent: number | null;
  upgradeMax: number | null;
};
