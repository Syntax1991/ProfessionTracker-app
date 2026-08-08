export type ProfessionCoverageEntry = {
  id: string;
  name: string;
  source: string;
};

export type ProfessionCharacterCoverage = {
  characterProfessionId: string;
  character: {
    id: string;
    name: string;
    realm: string;
    className: string;
    level: number;
  };
  skill: number;
  knowledgePoints: number;
  dataStatus:
    | "TRACKED"
    | "PARTIAL"
    | "UNTRACKED"
    | "NO_CATALOG";
  slots: ProfessionCoverageEntry[];
};

export type ProfessionOverviewItem = {
  id: string;
  key: string;
  name: string;
  category: string;
  characterCount: number;
  trackedCharacterCount: number;
  activeNodeCount: number;
};

export type ProfessionDetailView = {
  profession: {
    id: string;
    key: string;
    name: string;
    category: string;
  };
  summary: {
    characterCount: number;
    trackedCharacterCount: number;
    missingCharacterCount: number;
    slotCount: number;
  };
  characters: ProfessionCharacterCoverage[];
};