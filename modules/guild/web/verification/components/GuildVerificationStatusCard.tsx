import type { GuildVerificationStatus } from "../types/verification.types";

type GuildVerificationStatusCardProps = {
  status: GuildVerificationStatus;
};

export function GuildVerificationStatusCard({
  status
}: GuildVerificationStatusCardProps) {
  const guildName =
    status.guildName ??
    "Verified Guild";

  const realmName =
    status.realmName ??
    "Unknown realm";

  const verifiedCharacter =
    status.verifiedCharacter ??
    "Battle.net";

  const guildInitial =
    guildName
      .trim()
      .charAt(0)
      .toUpperCase() || "G";

  return (
    <section className="guild-context-bar">
      <div className="guild-context-identity">
        <div
          aria-hidden="true"
          className="guild-context-mark"
        >
          {guildInitial}
        </div>

        <div className="guild-context-copy">
          <span className="guild-context-realm">
            {realmName}
          </span>

          <div className="guild-context-title">
            <h2>{guildName}</h2>

            <span className="guild-context-verified">
              Verified
            </span>
          </div>

          <span className="guild-context-meta">
            Verified via{" "}
            {verifiedCharacter}
          </span>
        </div>
      </div>

      <span className="guild-context-rank">
        {status.isGuildMaster
          ? "Guild Master"
          : `Rank ${status.verifiedRank ?? "—"}`}
      </span>
    </section>
  );
}