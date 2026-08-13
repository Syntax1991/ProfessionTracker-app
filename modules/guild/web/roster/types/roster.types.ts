export type GuildMember = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  rank: string;
  rankIndex: number;
  note: string | null;
  officerNote: string | null;
  source: string;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  averageItemLevel: number | null;
  missingEnchantSlots: number | null;
  totalSocketCount: number | null;
  filledSocketCount: number | null;
  auditedAt: string | null;
};

export type GuildMemberInput = {
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  rank: string;
  rankIndex: number;
  note: string | null;
  officerNote: string | null;
};

export type GuildMemberListResponse = {
  items: GuildMember[];
  total: number;
};
