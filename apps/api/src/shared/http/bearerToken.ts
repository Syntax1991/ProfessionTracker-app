import type { Request } from "express";
import { AppError } from "../errors/AppError.js";

export function requireBearerToken(
  request: Request
): string {
  const header =
    request.headers.authorization;

  const token = header?.startsWith(
    "Bearer "
  )
    ? header.slice(
        "Bearer ".length
      )
    : null;

  if (!token) {
    throw new AppError(
      401,
      "Kein Raider-Login gefunden. Bitte zuerst mit Battle.net anmelden."
    );
  }

  return token;
}
