const storageKey =
  "syntrack.raiderSessionToken";

export function getRaiderSessionToken():
  string | null {
  return localStorage.getItem(
    storageKey
  );
}

export function setRaiderSessionToken(
  token: string
): void {
  localStorage.setItem(
    storageKey,
    token
  );
}

export function clearRaiderSessionToken():
  void {
  localStorage.removeItem(
    storageKey
  );
}
