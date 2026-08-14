import {
  apiRequest,
  getApiUrl
} from "../../../../../apps/web/src/shared/api/httpClient";

export function getRaiderLoginUrl():
  string {
  return getApiUrl(
    "/auth/raider/connect"
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
