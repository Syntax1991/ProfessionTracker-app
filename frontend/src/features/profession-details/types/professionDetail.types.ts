export type ProfessionOverviewItem = {
  id: string;
  key: string;
  name: string;
  category: string;
  characterCount: number;
  trackedCharacterCount: number;
  activeNodeCount: number;
};

export type ProfessionOverview = {
  items: ProfessionOverviewItem[];
};

export type ProfessionCoverageEntry = {
  id: string;
  name: string;
  rank: number;
  maxRank: number | null;
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

export type ProfessionDetail = {
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