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

export type MyDroptimizerReport = {
  id: string;
  memberId: string;
  reportId: string;
  reportUrl: string;
  publicTitle: string;
  charClass: string;
  spec: string;
  baselineDps: number;
  upgrades: DroptimizerUpgrade[];
  createdAt: string;
  updatedAt: string;
};
