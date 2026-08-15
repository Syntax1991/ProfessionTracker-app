export type RaiderLinkGuard = {
  getLinkedMember(token: string): Promise<{ id: string } | null>;
};

export type RaidSetupMembersInput = {
  memberIds: string[];
};
