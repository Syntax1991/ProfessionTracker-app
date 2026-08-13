export const raidTaskCategories = [
  "PREPARATION",
  "ASSIGNMENT",
  "STRATEGY",
  "CONSUMABLES"
] as const;

export const raidTaskPriorities = [
  "LOW",
  "NORMAL",
  "HIGH"
] as const;

export type RaidTaskCategory =
  (typeof raidTaskCategories)[number];

export type RaidTaskPriority =
  (typeof raidTaskPriorities)[number];

export type PersonalRaidTaskInput = {
  title: string;
  description?: string | undefined;
  category: RaidTaskCategory;
  priority: RaidTaskPriority;
  raidName?: string | undefined;
  dueAt?: string | undefined;
};

export type RaidTaskCompletionInput = {
  completed: boolean;
};
