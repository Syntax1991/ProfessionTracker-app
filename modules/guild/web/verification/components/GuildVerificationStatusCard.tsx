import type { GuildVerificationStatus } from "../types/verification.types";

type GuildVerificationStatusCardProps = {
  status: GuildVerificationStatus;
};

export function GuildVerificationStatusCard({
  status
}: GuildVerificationStatusCardProps) {
  return (
    <section className="panel guild-verification-status">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            VERIFIED
          </p>

          <h2>
            {status.guildName}
          </h2>

          <span>
            {status.realmName}
          </span>
        </div>

        <span className="integration-badge configured">
          {status.isGuildMaster
            ? "Guild Master"
            : `Rank ${status.verifiedRank}`}
        </span>
      </div>

      <p className="muted-text">
        Verified via{" "}
        {status.verifiedCharacter}.
      </p>
    </section>
  );
}
