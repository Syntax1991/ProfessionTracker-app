import { BattleNetImportService } from "./battlenet-import.service.js";
import type {
  BattleNetCharacterPreviewResult,
  BattleNetImportResult
} from "./battlenet.types.js";

export class BattleNetService {
  constructor(
    private readonly importService:
      BattleNetImportService
  ) {}

  listCharacters(
    token: string
  ): Promise<BattleNetCharacterPreviewResult> {
    return this.importService
      .listCharacters(token);
  }

  importCharacters(
    token: string,
    characterKeys: string[]
  ): Promise<BattleNetImportResult> {
    return this.importService
      .importCharacters(
        token,
        characterKeys
      );
  }
}
