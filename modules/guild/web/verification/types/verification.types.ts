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
