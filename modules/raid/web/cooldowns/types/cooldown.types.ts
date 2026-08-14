export type RaidCooldownAssignment = {
  id: string;
  bossId: string;
  memberId: string;
  abilityName: string;
  phaseLabel: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type RaidCooldownAssignmentInput = {
  memberId: string;
  abilityName: string;
  phaseLabel: string | null;
  sortOrder: number;
};

export type RaidCooldownAssignmentListResponse = {
  items: RaidCooldownAssignment[];
  total: number;
};
