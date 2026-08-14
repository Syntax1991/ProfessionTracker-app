import {
  apiRequest,
  getApiUrl
} from "../../../../../apps/web/src/shared/api/httpClient";
import type { RaiderSessionStatus } from "../types/raiderAuth.types";

export function getRaiderLoginUrl():
  string {
  return getApiUrl(
    "/auth/raider/connect"
  );
}

export function getRaiderSessionStatus():
  Promise<RaiderSessionStatus> {
  return apiRequest<RaiderSessionStatus>(
    "/auth/raider/session"
  );
}

export function raiderLogout():
  Promise<void> {
  return apiRequest<void>(
    "/auth/raider/logout",
    {
      method: "POST"
    }
  );
}
