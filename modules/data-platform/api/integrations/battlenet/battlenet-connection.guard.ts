import { AppError } from "../../../../../apps/api/src/shared/errors/AppError.js";
import type { BattleNetRepository } from "./battlenet.repository.js";

const tokenExpiryBufferMilliseconds =
  30 * 1000;

export async function getUsableBattleNetConnection(
  repository: BattleNetRepository
) {
  const connection =
    await repository.findConnection();

  if (
    !connection ||
    connection.expiresAt.getTime() -
        tokenExpiryBufferMilliseconds <=
      Date.now()
  ) {
    throw new AppError(
      401,
      "Bitte SynTrack zuerst mit Battle.net verbinden."
    );
  }

  return connection;
}
