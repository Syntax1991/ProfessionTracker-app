export type ProfessionReference = {
  id: string;
  key: string;
  name: string;
  category: string;
};

export type CharacterProfession = {
  id: string;
  skill: number;
  knowledgePoints: number;
  specializationSummary: string | null;
  profession: ProfessionReference;
};

export type Character = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  source: string;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  professions: CharacterProfession[];
};

export type CharacterInput = {
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  professionIds: string[];
};

export type CharacterListResponse = {
  items: Character[];
  total: number;
};