import type { GuildVerificationStatus } from "../types/verification.types";

type GuildVerificationStatusCardProps = {
  status: GuildVerificationStatus;
  isClearing: boolean;
  onClear: () => void;
};

export function GuildVerificationStatusCard({
  status,
  isClearing,
  onClear
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

      <div className="integration-actions">
        <button
          className="button button-secondary"
          disabled={isClearing}
          onClick={onClear}
          type="button"
        >
          {isClearing
            ? "Resetting…"
            : "Reset verification"}
        </button>
      </div>
    </section>
  );
}
