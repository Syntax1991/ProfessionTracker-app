import { randomBytes } from "node:crypto";
import { env } from "../../../../../apps/api/src/config/env.js";
import { AppError } from "../../../../../apps/api/src/shared/errors/AppError.js";
import { CharacterRepository } from "../../../../my-syntrack/api/characters/character.repository.js";
import { BattleNetClient } from "./battlenet.client.js";
import { BattleNetRepository } from "./battlenet.repository.js";

const oauthStateLifetimeMilliseconds =
  10 * 60 * 1000;

const tokenExpiryBufferMilliseconds =
  30 * 1000;

export class BattleNetAuthService {
  constructor(
    private readonly repository:
      BattleNetRepository,

    private readonly client:
      BattleNetClient,

    private readonly characterRepository:
      CharacterRepository
  ) {}

  async createAuthorizationUrl():
    Promise<string> {
    this.assertConfigured();

    const state =
      randomBytes(32).toString("hex");

    await this.repository.createOAuthState(
      state,
      new Date(
        Date.now() +
          oauthStateLifetimeMilliseconds
      )
    );

    return this.client.createAuthorizationUrl(
      state
    );
  }

  async handleCallback(
    code: string,
    state: string
  ): Promise<void> {
    this.assertConfigured();

    if (!code || !state) {
      throw new AppError(
        400,
        "Battle.net hat keinen vollständigen OAuth-Callback geliefert."
      );
    }

    const stateIsValid =
      await this.repository.consumeOAuthState(
        state
      );

    if (!stateIsValid) {
      throw new AppError(
        400,
        "Der Battle.net-Anmeldevorgang ist ungültig oder abgelaufen."
      );
    }

    const token =
      await this.client.exchangeAuthorizationCode(
        code
      );

    const battleTag =
      await this.loadBattleTag(
        token.access_token
      );

    const expiresInSeconds =
      token.expires_in ?? 86400;

    await this.repository.saveConnection({
      battleTag,
      accessToken: token.access_token,
      tokenType: token.token_type,
      scope: token.scope ?? null,
      expiresAt: new Date(
        Date.now() +
          expiresInSeconds * 1000
      )
    });
  }

  async getStatus() {
    const connection =
      await this.repository.findConnection();

    const connected = Boolean(
      connection &&
        this.isTokenUsable(
          connection.expiresAt
        )
    );

    const importedCharacterCount =
      await this.characterRepository.countBySource(
        "BATTLENET"
      );

    return {
      configured:
        this.hasClientCredentials(),
      connected,
      battleTag:
        connection?.battleTag ?? null,
      expiresAt:
        connection?.expiresAt.toISOString() ??
        null,
      region:
        env.BATTLENET_REGION,
      locale:
        env.BATTLENET_LOCALE,
      redirectUri:
        env.BATTLENET_REDIRECT_URI,
      importedCharacterCount
    };
  }

  async disconnect(): Promise<void> {
    await this.repository.disconnect();
  }

  private async loadBattleTag(
    accessToken: string
  ): Promise<string | null> {
    try {
      const userInfo =
        await this.client.getUserInfo(
          accessToken
        );

      return userInfo.battletag ?? null;
    }
    catch {
      // BattleTag is optional and must not block the WoW profile connection.
      return null;
    }
  }

  private assertConfigured(): void {
    if (!this.hasClientCredentials()) {
      throw new AppError(
        503,
        "Battle.net Client-ID oder Client-Secret fehlt in apps/api/.env."
      );
    }
  }

  private hasClientCredentials():
    boolean {
    return Boolean(
      env.BATTLENET_CLIENT_ID &&
        env.BATTLENET_CLIENT_SECRET
    );
  }

  private isTokenUsable(
    expiresAt: Date
  ): boolean {
    return (
      expiresAt.getTime() -
        tokenExpiryBufferMilliseconds >
      Date.now()
    );
  }
}
