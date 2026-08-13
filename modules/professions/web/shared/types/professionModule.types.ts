export type ProfessionCharacterOption = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  professions: Array<{
    id: string;
    skill: number;
    knowledgePoints: number;
    specializationSummary: string | null;
    profession: {
      id: string;
      key: string;
      name: string;
      category: string;
    };
  }>;
};

export type ProfessionCharacterListResponse = {
  items: ProfessionCharacterOption[];
  total: number;
};
