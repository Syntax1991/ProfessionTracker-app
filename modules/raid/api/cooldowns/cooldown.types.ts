export type RaidCooldownAssignmentInput = {
  memberId: string;
  abilityName: string;
  phaseLabel: string | null;
  timestampSeconds: number | null;
  sortOrder: number;
};

export type RaidBossPhaseMarkerInput = {
  label: string;
  startSeconds: number;
  sortOrder: number;
};

export type RaidBossFightDurationInput = {
  fightDurationSeconds: number | null;
};
