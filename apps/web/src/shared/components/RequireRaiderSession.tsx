import {
  useEffect,
  useState,
  type ReactNode
} from "react";
import {
  getRaiderLoginUrl,
  getRaiderSessionStatus
} from "../../../../../modules/data-platform/web/raider-auth/api/raiderAuthApi";
import {
  clearRaiderSessionToken,
  getRaiderSessionToken
} from "../api/raiderSession";
import { LoadingPanel } from "./LoadingPanel";

type RequireRaiderSessionProps = {
  children: ReactNode;
};

type GateStatus =
  | "checking"
  | "authenticated"
  | "unauthenticated";

export function RequireRaiderSession({
  children
}: RequireRaiderSessionProps) {
  const [status, setStatus] =
    useState<GateStatus>(
      "checking"
    );

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const token =
        getRaiderSessionToken();

      if (!token) {
        if (!cancelled) {
          setStatus(
            "unauthenticated"
          );
        }

        return;
      }

      try {
        await getRaiderSessionStatus();

        if (!cancelled) {
          setStatus(
            "authenticated"
          );
        }
      }
      catch {
        clearRaiderSessionToken();

        if (!cancelled) {
          setStatus(
            "unauthenticated"
          );
        }
      }
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="raider-session-gate">
        <LoadingPanel label="Checking your session…" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="raider-session-gate">
        <div className="raider-session-gate-card">
          <span className="brand-mark">
            ST
          </span>

          <h1>
            Sign in to SynTrack
          </h1>

          <p>
            Sign in with your Battle.net account to continue.
          </p>

          <a
            className="button button-primary"
            href={getRaiderLoginUrl()}
          >
            Sign in with Battle.net
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
