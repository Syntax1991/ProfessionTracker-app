export type GuildVerificationCandidateCharacter = {
  name: string;
  realmSlug: string;
  level: number;
};

export type GuildVerificationCandidate = {
  guildName: string;
  guildSlug: string;
  realmName: string;
  realmSlug: string;
  faction: string | null;
  characters: GuildVerificationCandidateCharacter[];
};

export type GuildVerificationInput = {
  characterName: string;
  characterRealmSlug: string;
};

export type GuildVerificationLookupInput = {
  realmName: string;
  guildName: string;
};

export type GuildVerificationGuard = {
  ensureVerified(): Promise<void>;
  requireCurrentOfficer(
    token: string
  ): Promise<{ id: string }>;
};

export type LinkedGuildMemberLookup = {
  getLinkedMember(token: string): Promise<{
    id: string;
    name: string;
    realm: string;
  } | null>;
};

export type GuildVerificationStatus = {
  verified: boolean;
  guildName: string | null;
  realmName: string | null;
  verifiedCharacter: string | null;
  verifiedRank: number | null;
  isGuildMaster: boolean;
  leadershipThreshold: number;
  verifiedAt: string | null;
};
