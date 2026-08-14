export type RaiderLinkGuard = {
  getLinkedMember(
    token: string
  ): Promise<{ id: string } | null>;
};

export type DroptimizerReportInput = {
  reportUrl: string;
};

export type DroptimizerUpgrade = {
  itemId: number;
  name: string;
  slot: string;
  bossName: string;
  itemLevel: number;
  dps: number;
  dpsGain: number;
  dpsGainPct: number;
};

export type RaidbotsProfilesetResult = {
  name: string;
  mean: number;
};

export type RaidbotsReportData = {
  simbot: {
    simType: string;
    player: string;
    charClass: string;
    spec: string;
    publicTitle: string;
  };
  sim: {
    players: Array<{
      collected_data: {
        dps: { mean: number };
      };
    }>;
    profilesets: {
      results: RaidbotsProfilesetResult[];
    };
  };
};
