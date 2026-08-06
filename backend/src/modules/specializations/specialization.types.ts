export type SpecializationProgressInput = {
  nodeId: string;
  rank: number;
};

export type SpecializationNodeView = {
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
  children: SpecializationNodeView[];
};

export type SpecializationTreeView = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  expansion: string;
  sortOrder: number;
  nodes: SpecializationNodeView[];
};