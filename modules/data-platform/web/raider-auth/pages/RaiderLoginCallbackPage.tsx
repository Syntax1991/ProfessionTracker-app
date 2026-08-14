import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { setRaiderSessionToken } from "../../../../../apps/web/src/shared/api/raiderSession";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";

function extractTokenFromHash(
  hash: string
): string | null {
  const match =
    /token=([^&]+)/u.exec(hash);

  return match
    ? decodeURIComponent(match[1])
    : null;
}

export function RaiderLoginCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] =
    useSearchParams();

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const token = extractTokenFromHash(
      window.location.hash
    );

    if (token) {
      setRaiderSessionToken(token);

      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );

      navigate(
        "/guild/raider-link",
        {
          replace: true
        }
      );

      return;
    }

    setError(
      searchParams.get("error") ??
        "Battle.net-Login fehlgeschlagen."
    );
  }, [navigate, searchParams]);

  return (
    <>
      <PageHeader
        description="Connecting your Battle.net account."
        eyebrow="LOGIN"
        title="Battle.net Login"
      />

      {error ? (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      ) : (
        <LoadingPanel />
      )}
    </>
  );
}
