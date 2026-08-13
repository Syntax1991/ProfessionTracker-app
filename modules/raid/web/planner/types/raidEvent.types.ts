export type RaidDifficulty =
  | "LFR"
  | "NORMAL"
  | "HEROIC"
  | "MYTHIC";

export type RaidEvent = {
  id: string;
  title: string;
  raidInstance: string;
  difficulty: RaidDifficulty;
  scheduledAt: string;
  teamId: string | null;
  teamName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RaidEventInput = {
  title: string;
  raidInstance: string;
  difficulty: RaidDifficulty;
  scheduledAt: string;
  teamId: string | null;
  notes: string | null;
};

export type RaidEventListResponse = {
  items: RaidEvent[];
  total: number;
};
