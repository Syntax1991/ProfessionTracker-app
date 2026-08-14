import { getRaiderLoginUrl } from "../../../../data-platform/web/raider-auth/api/raiderAuthApi";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import type { RaiderLinkResolution } from "../types/raiderLink.types";

type RaiderLinkPanelProps = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isClaiming: boolean;
  resolution: RaiderLinkResolution | null;
  onClaim: (
    memberId: string
  ) => void;
  onLogout: () => void;
};

export function RaiderLinkPanel({
  isLoggedIn,
  isLoading,
  isClaiming,
  resolution,
  onClaim,
  onLogout
}: RaiderLinkPanelProps) {
  if (!isLoggedIn) {
    return (
      <section className="panel guild-verification-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              MY RAIDER LOGIN
            </p>

            <h2>
              Sign in with Battle.net
            </h2>
          </div>
        </div>

        <div className="instruction-box">
          <strong>
            Why sign in?
          </strong>

          <p>
            Signing in links you to your own guild roster entry, so
            you can manage your own raid signups without an officer
            doing it for you.
          </p>
        </div>

        <div className="integration-actions">
          <a
            className="button button-primary"
            href={getRaiderLoginUrl()}
          >
            Sign in with Battle.net
          </a>
        </div>
      </section>
    );
  }

  if (isLoading || !resolution) {
    return <LoadingPanel />;
  }

  return (
    <section className="panel guild-verification-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            MY RAIDER LOGIN
          </p>

          <h2>
            {resolution.status ===
            "linked"
              ? resolution.member.name
              : "Which character is you?"}
          </h2>
        </div>

        {resolution.status ===
          "linked" && (
          <span className="integration-badge configured">
            Linked
          </span>
        )}
      </div>

      {resolution.status ===
        "linked" && (
        <>
          <p className="muted-text">
            {resolution.member.className}
            {" · "}
            {resolution.member.realm}
          </p>

          <div className="integration-actions">
            <button
              className="button button-secondary"
              onClick={onLogout}
              type="button"
            >
              Sign out
            </button>
          </div>
        </>
      )}

      {resolution.status ===
        "choose" && (
        <div className="guild-verification-candidates">
          {resolution.candidates.map(
            (candidate) => (
              <article
                className="guild-verification-candidate"
                key={candidate.id}
              >
                <div className="guild-verification-candidate-heading">
                  <strong>
                    {candidate.name}
                  </strong>

                  <span>
                    {candidate.className}
                    {" · "}
                    {candidate.realm}
                  </span>
                </div>

                <button
                  className="button button-secondary"
                  disabled={isClaiming}
                  onClick={() =>
                    onClaim(
                      candidate.id
                    )
                  }
                  type="button"
                >
                  This is me
                </button>
              </article>
            )
          )}
        </div>
      )}

      {resolution.status ===
        "unmatched" && (
        <p className="muted-text">
          None of your Battle.net characters are on the guild
          roster yet. Ask an officer to add you, then sign in again.
        </p>
      )}
    </section>
  );
}
