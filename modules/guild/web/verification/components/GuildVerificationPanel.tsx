import type { GuildVerificationCandidate } from "../types/verification.types";

type GuildVerificationPanelProps = {
  candidates: GuildVerificationCandidate[] | null;
  isLoadingCandidates: boolean;
  isVerifying: boolean;
  onLoadCandidates: () => void;
  onVerify: (
    characterName: string,
    characterRealmSlug: string
  ) => void;
};

export function GuildVerificationPanel({
  candidates,
  isLoadingCandidates,
  isVerifying,
  onLoadCandidates,
  onVerify
}: GuildVerificationPanelProps) {
  return (
    <section className="panel guild-verification-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            GUILD VERIFICATION
          </p>

          <h2>
            Verify guild leadership
          </h2>
        </div>
      </div>

      <div className="instruction-box">
        <strong>
          Why verify?
        </strong>

        <p>
          Only the guild leadership can manage the roster. SynTrack
          checks your Battle.net characters against Blizzard&apos;s
          official guild roster. Blizzard does not expose custom rank
          titles, so only the top ranks (Guild Master and the next
          two ranks) count as leadership.
        </p>
      </div>

      <div className="integration-actions">
        <button
          className="button button-primary"
          disabled={
            isLoadingCandidates
          }
          onClick={onLoadCandidates}
          type="button"
        >
          {isLoadingCandidates
            ? "Loading…"
            : "Load my guilds"}
        </button>
      </div>

      {candidates &&
        candidates.length === 0 && (
        <p className="muted-text">
          None of your connected Battle.net characters are
          currently in a guild.
        </p>
      )}

      {candidates &&
        candidates.length > 0 && (
        <div className="guild-verification-candidates">
          {candidates.map(
            (candidate) => (
              <article
                className="guild-verification-candidate"
                key={
                  `${candidate.realmSlug}-${candidate.guildSlug}`
                }
              >
                <div className="guild-verification-candidate-heading">
                  <strong>
                    {candidate.guildName}
                  </strong>

                  <span>
                    {candidate.realmName}
                    {candidate.faction
                      ? ` · ${candidate.faction}`
                      : ""}
                  </span>
                </div>

                <div className="guild-verification-candidate-characters">
                  {candidate.characters.map(
                    (character) => (
                      <button
                        className="button button-secondary"
                        disabled={
                          isVerifying
                        }
                        key={
                          `${character.realmSlug}-${character.name}`
                        }
                        onClick={() =>
                          onVerify(
                            character.name,
                            character.realmSlug
                          )
                        }
                        type="button"
                      >
                        Verify as{" "}
                        {character.name}
                      </button>
                    )
                  )}
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}
