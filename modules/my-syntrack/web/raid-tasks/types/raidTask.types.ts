export type RaidTaskCategory =
  | "PREPARATION"
  | "ASSIGNMENT"
  | "STRATEGY"
  | "CONSUMABLES";

export type RaidTaskPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH";

export type PersonalRaidTask = {
  id: string;
  title: string;
  description: string | null;
  category: RaidTaskCategory;
  priority: RaidTaskPriority;
  raidName: string | null;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type RaidTaskCharacter = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  tasks: PersonalRaidTask[];
  openTaskCount: number;
  completedTaskCount: number;
};

export type RaidTaskOverview = {
  characters: RaidTaskCharacter[];
  summary: {
    totalTaskCount: number;
    openTaskCount: number;
    completedTaskCount: number;
    dueSoonTaskCount: number;
  };
};

export type PersonalRaidTaskInput = {
  title: string;
  description?: string;
  category: RaidTaskCategory;
  priority: RaidTaskPriority;
  raidName?: string;
  dueAt?: string;
};

export type RaidTaskFilter =
  | "open"
  | "completed"
  | "all";
