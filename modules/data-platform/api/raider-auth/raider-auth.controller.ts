import type {
  RequestHandler
} from "express";
import { env } from "../../../../apps/api/src/config/env.js";
import { requireBearerToken } from "../../../../apps/api/src/shared/http/bearerToken.js";
import { RaiderAuthService } from "./raider-auth.service.js";

function getQueryValue(
  value: unknown
): string {
  return typeof value === "string"
    ? value
    : "";
}

export class RaiderAuthController {
  constructor(
    private readonly service:
      RaiderAuthService
  ) {}

  connect: RequestHandler = async (
    _request,
    response
  ) => {
    const authorizationUrl =
      await this.service
        .createAuthorizationUrl();

    response.redirect(
      authorizationUrl
    );
  };

  callback: RequestHandler = async (
    request,
    response
  ) => {
    const frontendUrl = new URL(
      "/raider-login",
      env.FRONTEND_ORIGIN
    );

    try {
      const providerError =
        getQueryValue(
          request.query.error_description
        ) ||
        getQueryValue(
          request.query.error
        );

      if (providerError) {
        throw new Error(
          providerError
        );
      }

      const code =
        getQueryValue(
          request.query.code
        );

      const state =
        getQueryValue(
          request.query.state
        );

      const result =
        await this.service.handleCallback(
          code,
          state
        );

      frontendUrl.hash =
        `token=${result.token}`;
    }
    catch (error) {
      frontendUrl.searchParams.set(
        "error",
        error instanceof Error
          ? error.message
          : "Raider-Login mit Battle.net fehlgeschlagen."
      );
    }

    response.redirect(
      frontendUrl.toString()
    );
  };

  getSession: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    response.json(
      await this.service.getSessionStatus(
        token
      )
    );
  };

  logout: RequestHandler = async (
    request,
    response
  ) => {
    const token =
      requireBearerToken(request);

    await this.service.logout(token);

    response.status(204).send();
  };
}
