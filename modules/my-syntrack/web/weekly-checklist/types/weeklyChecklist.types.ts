export type WeeklyChecklistPeriod = {
  key: string;
  startsAt: string;
  endsAt: string;
};

export type WeeklyChecklistTask = {
  key: string;
  title: string;
  description: string;
  category: string;
  sortOrder: number;
};

export type WeeklyChecklistCharacter = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  completedTaskKeys: string[];
};

export type WeeklyChecklistResponse = {
  period: WeeklyChecklistPeriod;
  tasks: WeeklyChecklistTask[];
  characters: WeeklyChecklistCharacter[];
  summary: {
    completedTaskCount: number;
    totalTaskCount: number;
    completedCharacterCount: number;
  };
};
