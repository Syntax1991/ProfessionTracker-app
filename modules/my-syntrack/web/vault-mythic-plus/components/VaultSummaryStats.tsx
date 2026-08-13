import type { VaultMythicPlusResponse } from "../types/vaultMythicPlus.types";

type VaultSummaryStatsProps = {
  overview: VaultMythicPlusResponse;
};

export function VaultSummaryStats({
  overview
}: VaultSummaryStatsProps) {
  const resetLabel =
    new Intl.DateTimeFormat(
      "en",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      }
    ).format(
      new Date(overview.period.endsAt)
    );

  return (
    <section className="vault-summary-grid">
      <article className="vault-summary-card">
        <span>Dungeon runs</span>
        <strong>
          {overview.summary.runCount}
        </strong>
        <small>logged this period</small>
      </article>

      <article className="vault-summary-card">
        <span>Vault active</span>
        <strong>
          {
            overview.summary
              .charactersWithVault
          }
        </strong>
        <small>characters with a slot</small>
      </article>

      <article className="vault-summary-card vault-summary-accent">
        <span>Unlocked slots</span>
        <strong>
          {overview.summary.unlockedSlotCount}
        </strong>
        <small>
          across {overview.characters.length}
          {" characters"}
        </small>
      </article>

      <article className="vault-summary-card vault-summary-reset">
        <span>Next reset</span>
        <strong>{resetLabel}</strong>
        <small>current vault period</small>
      </article>
    </section>
  );
}
