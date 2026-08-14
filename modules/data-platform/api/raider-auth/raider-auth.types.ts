import type { ImportableBattleNetCharacter } from "../integrations/battlenet/battlenet-import.mapper.js";

export type RaiderSessionResult = {
  token: string;
  raiderAccountId: string;
  characters: ImportableBattleNetCharacter[];
};

export type RaiderSessionGuard = {
  requireSession(
    token: string
  ): Promise<RaiderSessionResult>;
};
