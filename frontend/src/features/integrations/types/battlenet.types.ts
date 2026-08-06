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