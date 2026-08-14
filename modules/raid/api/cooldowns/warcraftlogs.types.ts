export type WarcraftLogsFightCasts = {
  fightDurationSeconds: number;
  reportCode: string;
  fightId: number;
  casts: Array<{
    abilityName: string;
    abilityIcon: string | null;
    timestampSeconds: number;
  }>;
};

export type WclZone = {
  encounters: Array<{
    id: number;
    name: string;
  }>;
};

export type WclActor = {
  id: number;
  name: string;
  subType: string;
};

export type WclCastEvent = {
  timestamp: number;
  type: string;
  abilityGameID: number;
};
