export type GuildWeeklyProgressEntry = {
  memberId: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  rank: string;
  tracked: boolean;
  completedTaskCount: number;
  totalTaskCount: number;
  mythicPlusRunCount: number;
  bestKeystoneLevel: number | null;
};

export type GuildWeeklyProgressSummary = {
  periodKey: string;
  totalTaskCount: number;
  items: GuildWeeklyProgressEntry[];
};
