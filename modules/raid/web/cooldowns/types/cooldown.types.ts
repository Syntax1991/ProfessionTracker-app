export type RaidCooldownAssignment = {
  id: string;
  bossId: string;
  memberId: string;
  abilityName: string;
  phaseLabel: string | null;
  timestampSeconds: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type RaidCooldownAssignmentInput = {
  memberId: string;
  abilityName: string;
  phaseLabel: string | null;
  timestampSeconds: number | null;
  sortOrder: number;
};

export type RaidCooldownAssignmentListResponse = {
  items: RaidCooldownAssignment[];
  total: number;
};

export type RaidBossPhaseMarker = {
  id: string;
  bossId: string;
  label: string;
  startSeconds: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type RaidBossPhaseMarkerInput = {
  label: string;
  startSeconds: number;
  sortOrder: number;
};

export type RaidBossPhaseMarkerListResponse = {
  items: RaidBossPhaseMarker[];
  total: number;
};
