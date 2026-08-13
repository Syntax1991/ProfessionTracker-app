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
