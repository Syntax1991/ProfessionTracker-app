export type GuildAuditRefreshResult = {
  totalMembers: number;
  auditedMembers: number;
  skippedMembers: number;
};

export type GuildMemberGearSlotStatus =
  | "READY"
  | "MISSING"
  | "NOT_APPLICABLE";

export type GuildMemberGearSlot = {
  id: string;
  memberId: string;
  slotKey: string;
  itemName: string | null;
  itemLevel: number | null;
  quality: string | null;
  enchantStatus: GuildMemberGearSlotStatus;
  socketCount: number;
  filledSocketCount: number;
  upgradeCurrent: number | null;
  upgradeMax: number | null;
  updatedAt: string;
};

export type GuildMemberGearSlotListResponse = {
  items: GuildMemberGearSlot[];
  total: number;
};
