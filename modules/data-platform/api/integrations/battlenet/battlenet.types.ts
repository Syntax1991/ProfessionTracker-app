export type BattleNetTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
};

export type BattleNetUserInfo = {
  id?: number;
  sub?: string;
  battletag?: string;
};

export type BattleNetAccountCharacter = {
  id?: number;
  name?: string;
  level?: number;
  realm?: {
    id?: number;
    name?: string;
    slug?: string;
  };
  playable_class?: {
    id?: number;
    name?: string;
  };
};

export type BattleNetAccountProfile = {
  wow_accounts?: Array<{
    id?: number;
    characters?: BattleNetAccountCharacter[];
  }>;
};

export type BattleNetProfessionTier = {
  skill_points?: number;
  max_skill_points?: number;
  tier?: {
    id?: number;
    name?: string;
  };
};

export type BattleNetProfessionEntry = {
  profession?: {
    id?: number;
    name?: string;
  };
  tiers?: BattleNetProfessionTier[];
};

export type BattleNetProfessionsResponse = {
  primaries?: BattleNetProfessionEntry[];
  secondaries?: BattleNetProfessionEntry[];
};

export type BattleNetConnectionInput = {
  battleTag: string | null;
  accessToken: string;
  tokenType: string;
  scope: string | null;
  expiresAt: Date;
};

export type BattleNetCharacterPreview = {
  key: string;
  battleNetId: string;
  name: string;
  realm: string;
  realmSlug: string;
  className: string;
  level: number;
  imported: boolean;
};

export type BattleNetCharacterPreviewResult = {
  items: BattleNetCharacterPreview[];
  totalCharacters: number;
  defaultMinimumLevel: number;
};

export type BattleNetImportFailure = {
  name: string;
  realm: string;
  error: string;
};

export type BattleNetImportResult = {
  totalCharacters: number;
  importedCharacters: number;
  failedCharacters: BattleNetImportFailure[];
};