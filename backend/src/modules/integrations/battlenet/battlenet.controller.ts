import type {
  RequestHandler
} from "express";
import { env } from "../../../config/env.js";
import { BattleNetService } from "./battlenet.service.js";
import { battleNetImportInputSchema } from "./battlenet.validation.js";

function getQueryValue(
  value: unknown
): string {
  return typeof value === "string"
    ? value
    : "";
}

export class BattleNetController {
  constructor(
    private readonly service:
      BattleNetService
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
      "/battlenet",
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

      await this.service.handleCallback(
        code,
        state
      );

      frontendUrl.searchParams.set(
        "connected",
        "1"
      );
    }
    catch (error) {
      frontendUrl.searchParams.set(
        "error",
        error instanceof Error
          ? error.message
          : "Battle.net-Verbindung fehlgeschlagen."
      );
    }

    response.redirect(
      frontendUrl.toString()
    );
  };

  getStatus: RequestHandler = async (
    _request,
    response
  ) => {
    response.json(
      await this.service.getStatus()
    );
  };

  listCharacters:
    RequestHandler = async (
      _request,
      response
    ) => {
      response.json(
        await this.service
          .listCharacters()
      );
    };

  importCharacters:
    RequestHandler = async (
      request,
      response
    ) => {
      const input =
        battleNetImportInputSchema
          .parse(request.body);

      response.json(
        await this.service
          .importCharacters(
            input.characterKeys
          )
      );
    };

  disconnect:
    RequestHandler = async (
      _request,
      response
    ) => {
      await this.service.disconnect();

      response.status(204).send();
    };
}