import { randomBytes } from "node:crypto";
import { env } from "../../../../apps/api/src/config/env.js";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { normalizeBattleNetCharacters } from "../integrations/battlenet/battlenet-import.mapper.js";
import type { BattleNetClient } from "../integrations/battlenet/battlenet.client.js";
import type { BattleNetRepository } from "../integrations/battlenet/battlenet.repository.js";
import { RaiderAuthRepository } from "./raider-auth.repository.js";
import type {
  RaiderSessionResult,
  RaiderSessionStatus
} from "./raider-auth.types.js";

const oauthStateLifetimeMilliseconds =
  10 * 60 * 1000;

const sessionLifetimeMilliseconds =
  30 * 24 * 60 * 60 * 1000;

const tokenExpiryBufferMilliseconds =
  30 * 1000;

export class RaiderAuthService {
  constructor(
    private readonly repository:
      RaiderAuthRepository,

    private readonly battleNetRepository:
      BattleNetRepository,

    private readonly battleNetClient:
      BattleNetClient
  ) {}

  async createAuthorizationUrl():
    Promise<string> {
    this.assertConfigured();

    const state =
      randomBytes(32).toString("hex");

    await this.battleNetRepository.createOAuthState(
      state,
      new Date(
        Date.now() +
          oauthStateLifetimeMilliseconds
      )
    );

    return this.battleNetClient.createAuthorizationUrl(
      state,
      env.BATTLENET_RAIDER_REDIRECT_URI
    );
  }

  async handleCallback(
    code: string,
    state: string
  ): Promise<RaiderSessionResult> {
    this.assertConfigured();

    if (!code || !state) {
      throw new AppError(
        400,
        "Battle.net hat keinen vollständigen OAuth-Callback geliefert."
      );
    }

    const stateIsValid =
      await this.battleNetRepository.consumeOAuthState(
        state
      );

    if (!stateIsValid) {
      throw new AppError(
        400,
        "Der Battle.net-Anmeldevorgang ist ungültig oder abgelaufen."
      );
    }

    const token =
      await this.battleNetClient.exchangeAuthorizationCode(
        code,
        env.BATTLENET_RAIDER_REDIRECT_URI
      );

    const userInfo =
      await this.battleNetClient.getUserInfo(
        token.access_token
      );

    const battleTag =
      userInfo.battletag ?? null;

    const accountProfile =
      await this.battleNetClient.getAccountProfile(
        token.access_token
      );

    const characters =
      normalizeBattleNetCharacters(
        accountProfile
      );

    const existingAccount =
      battleTag
        ? await this.repository.findAccountByBattleTag(
            battleTag
          )
        : null;

    const account =
      existingAccount ??
      (await this.repository.createAccount(
        battleTag
      ));

    const expiresInSeconds =
      token.expires_in ?? 86400;

    await this.repository.updateAccountToken(
      account.id,
      {
        accessToken:
          token.access_token,
        tokenType:
          token.token_type,
        scope:
          token.scope ?? null,
        tokenExpiresAt: new Date(
          Date.now() +
            expiresInSeconds * 1000
        )
      }
    );

    const sessionToken =
      randomBytes(32).toString("hex");

    await this.repository.createSession({
      token: sessionToken,
      raiderAccountId: account.id,
      charactersJson: JSON.stringify(
        characters
      ),
      expiresAt: new Date(
        Date.now() +
          sessionLifetimeMilliseconds
      )
    });

    return {
      token: sessionToken,
      raiderAccountId: account.id,
      characters
    };
  }

  async requireSession(
    token: string
  ): Promise<RaiderSessionResult> {
    const session =
      await this.repository.findValidSession(
        token
      );

    if (!session) {
      throw new AppError(
        401,
        "Der Raider-Login ist ungültig oder abgelaufen. Bitte erneut mit Battle.net anmelden."
      );
    }

    return {
      token,
      raiderAccountId:
        session.raiderAccountId,
      characters: JSON.parse(
        session.charactersJson
      )
    };
  }

  async requireUsableAccessToken(
    token: string
  ): Promise<{
    accessToken: string;
  }> {
    const session =
      await this.repository.findValidSession(
        token
      );

    if (!session) {
      throw new AppError(
        401,
        "Der Raider-Login ist ungültig oder abgelaufen. Bitte erneut mit Battle.net anmelden."
      );
    }

    const account = session.account;

    const tokenIsUsable = Boolean(
      account.accessToken &&
        account.tokenExpiresAt &&
        account.tokenExpiresAt.getTime() -
            tokenExpiryBufferMilliseconds >
          Date.now()
    );

    if (
      !tokenIsUsable ||
      !account.accessToken
    ) {
      throw new AppError(
        401,
        "Die Battle.net-Verbindung ist abgelaufen. Bitte erneut mit Battle.net anmelden."
      );
    }

    return {
      accessToken:
        account.accessToken
    };
  }

  async getSessionStatus(
    token: string
  ): Promise<RaiderSessionStatus> {
    const session =
      await this.repository.findValidSession(
        token
      );

    if (!session) {
      throw new AppError(
        401,
        "Der Raider-Login ist ungültig oder abgelaufen. Bitte erneut mit Battle.net anmelden."
      );
    }

    return {
      battleTag:
        session.account.battleTag,
      expiresAt:
        session.expiresAt.toISOString()
    };
  }

  async logout(
    token: string
  ): Promise<void> {
    await this.repository.deleteSession(
      token
    );
  }

  private assertConfigured(): void {
    if (
      !env.BATTLENET_CLIENT_ID ||
      !env.BATTLENET_CLIENT_SECRET
    ) {
      throw new AppError(
        503,
        "Battle.net Client-ID oder Client-Secret fehlt in apps/api/.env."
      );
    }
  }
}
