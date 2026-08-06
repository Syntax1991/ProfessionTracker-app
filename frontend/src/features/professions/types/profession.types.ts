export type Profession = {
  id: string;
  key: string;
  name: string;
  category: string;
  order: number;
  assignmentCount: number;
};

export type ProfessionListResponse = {
  items: Profession[];
};