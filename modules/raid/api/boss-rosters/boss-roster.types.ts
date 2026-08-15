export type RaidBossInput = {
  name: string;
  sortOrder: number;
};

export type RaidBossRosterEntryInput = {
  status: string;
};

export type RaiderLinkGuard = {
  getLinkedMember(
    token: string
  ): Promise<{ id: string } | null>;
};
