import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";

export type RaidSignupStatus =
  | "PRESENT"
  | "TENTATIVE"
  | "ABSENT";

export type RaidSignupEntry = {
  member: GuildMember;
  status: RaidSignupStatus | null;
  updatedAt: string | null;
};

export type RaidSignupListResponse = {
  items: RaidSignupEntry[];
  total: number;
};
