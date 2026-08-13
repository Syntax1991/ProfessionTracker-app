export type WeeklyChecklistTaskDefinition = {
  key: string;
  title: string;
  description: string;
  category: string;
  sortOrder: number;
};

export type WeeklyTaskUpdateInput = {
  completed: boolean;
};
