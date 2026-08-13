export type MythicPlusRun = {
  id: string;
  dungeonName: string | null;
  keyLevel: number;
  completedAt: string;
};

export type MythicPlusVaultSlot = {
  threshold: number;
  unlocked: boolean;
  keyLevel: number | null;
};

export type VaultCharacter = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  runs: MythicPlusRun[];
  vaultSlots: MythicPlusVaultSlot[];
  highestKeyLevel: number | null;
};

export type VaultMythicPlusResponse = {
  period: {
    key: string;
    startsAt: string;
    endsAt: string;
  };
  thresholds: number[];
  characters: VaultCharacter[];
  summary: {
    runCount: number;
    unlockedSlotCount: number;
    charactersWithVault: number;
  };
};

export type MythicPlusRunInput = {
  dungeonName?: string;
  keyLevel: number;
};
