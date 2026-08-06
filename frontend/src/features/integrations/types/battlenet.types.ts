export type BattleNetStatus = {
  configured: boolean;
  connected: boolean;
  battleTag: string | null;
  expiresAt: string | null;
  region: string;
  locale: string;
  redirectUri: string;
  importedCharacterCount: number;
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
  failedCharacters:
    BattleNetImportFailure[];
};