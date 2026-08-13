export type ProfessionCoverage = {
  id: string;
  key: string;
  name: string;
  category: string;
  assignmentCount: number;
};

export type DashboardCharacterProfession = {
  id: string;
  skill: number;
  knowledgePoints: number;
  profession: {
    id: string;
    key: string;
    name: string;
    category: string;
  };
};

export type DashboardCharacter = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  source: string;
  lastSyncedAt: string | null;
  professions:
    DashboardCharacterProfession[];
};

export type DashboardSummary = {
  characterCount: number;
  craftingReadyCharacterCount: number;
  syncedCharacterCount: number;
  realmCount: number;
  coveredProfessionCount: number;
  totalProfessionCount: number;
  minimumCraftingLevel: number;
  professionCoverage: ProfessionCoverage[];
  characters: DashboardCharacter[];
};
