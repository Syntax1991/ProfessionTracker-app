export type WeeklyChecklistTaskDefinition = {
  key: string;
  title: string;
  description: string;
  category: string;
  sortOrder: number;
};

export type WeeklyChecklistPeriod = {
  key: string;
  startsAt: string;
  endsAt: string;
};

export type WeeklyTaskUpdateInput = {
  completed: boolean;
};
