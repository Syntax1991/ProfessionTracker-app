export type MythicPlusRunInput = {
  dungeonName?: string | undefined;
  keyLevel: number;
};

export type MythicPlusVaultSlot = {
  threshold: number;
  unlocked: boolean;
  keyLevel: number | null;
};
