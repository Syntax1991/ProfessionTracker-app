import { env } from "../../../../apps/api/src/config/env.js";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";

const oauthTokenUrl =
  "https://www.warcraftlogs.com/oauth/token";

const graphqlUrl =
  "https://www.warcraftlogs.com/api/v2/client";

export async function getWarcraftLogsToken(): Promise<string> {
  const credentials = Buffer.from(
    `${env.WARCRAFTLOGS_CLIENT_ID}:${env.WARCRAFTLOGS_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    oauthTokenUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type:
          "client_credentials"
      })
    }
  );

  const payload =
    (await response.json()) as {
      access_token?: string;
    };

  if (
    !response.ok ||
    typeof payload.access_token !==
      "string"
  ) {
    throw new AppError(
      502,
      "Warcraft-Logs-Anmeldung fehlgeschlagen."
    );
  }

  return payload.access_token;
}

export async function queryWarcraftLogs<T>(
  token: string,
  query: string
): Promise<T> {
  const response = await fetch(
    graphqlUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({ query })
    }
  );

  const payload =
    (await response.json()) as {
      data?: T;
      errors?: unknown;
    };

  if (
    !response.ok ||
    payload.errors ||
    !payload.data
  ) {
    throw new AppError(
      502,
      "Warcraft-Logs-Anfrage fehlgeschlagen.",
      payload.errors
    );
  }

  return payload.data;
}
