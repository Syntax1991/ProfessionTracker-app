const apiBaseUrl =
  import.meta.env.VITE_API_URL ??
  "http://localhost:4000/api";

type ApiErrorResponse = {
  error?: string;
  details?: unknown;
};

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload =
    (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse;

    throw new Error(
      errorPayload.error ??
        `API request failed with status ${response.status}.`
    );
  }

  return payload as T;
}