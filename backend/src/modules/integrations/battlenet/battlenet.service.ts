import { BattleNetAuthService } from "./battlenet-auth.service.js";
import { BattleNetImportService } from "./battlenet-import.service.js";
import type {
  BattleNetCharacterPreviewResult,
  BattleNetImportResult
} from "./battlenet.types.js";

export class BattleNetService {
  constructor(
    private readonly authService:
      BattleNetAuthService,

    private readonly importService:
      BattleNetImportService
  ) {}

  createAuthorizationUrl():
    Promise<string> {
    return this.authService
      .createAuthorizationUrl();
  }

  handleCallback(
    code: string,
    state: string
  ): Promise<void> {
    return this.authService
      .handleCallback(
        code,
        state
      );
  }

  getStatus() {
    return this.authService
      .getStatus();
  }

  listCharacters():
    Promise<BattleNetCharacterPreviewResult> {
    return this.importService
      .listCharacters();
  }

  importCharacters(
    characterKeys: string[]
  ): Promise<BattleNetImportResult> {
    return this.importService
      .importCharacters(
        characterKeys
      );
  }

  disconnect(): Promise<void> {
    return this.authService
      .disconnect();
  }
}