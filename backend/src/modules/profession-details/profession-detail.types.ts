export type ProfessionCoverageEntry = {
  id: string;
  name: string;
  path: string;
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
    source: string;
  };
  skill: number;
  knowledgePoints: number;
  specializationSummary: string | null;
  dataStatus:
    | "TRACKED"
    | "PARTIAL"
    | "UNTRACKED"
    | "NO_CATALOG";
  specializations: ProfessionCoverageEntry[];
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
    specializationCount: number;
    slotCount: number;
  };
  characters: ProfessionCharacterCoverage[];
};