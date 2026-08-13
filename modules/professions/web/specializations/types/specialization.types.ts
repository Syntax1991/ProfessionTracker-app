export type SpecializationNode = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  maxRank: number | null;
  sortOrder: number;
  parentNodeId: string | null;
  rank: number;
  source: string | null;
  lastSyncedAt: string | null;
  children: SpecializationNode[];
};

export type SpecializationTree = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  expansion: string;
  sortOrder: number;
  nodes: SpecializationNode[];
};

export type CharacterProfessionSpecialization = {
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
  trees: SpecializationTree[];
};

export type CharacterSpecializationOverview = {
  character: {
    id: string;
    name: string;
    realm: string;
    className: string;
    level: number;
  };
  professions:
    CharacterProfessionSpecialization[];
};

export type SpecializationProgressInput = {
  nodeId: string;
  rank: number;
};