import type { DashboardSummary } from "../types/dashboard.types";

type DashboardStatsProps = {
  summary: DashboardSummary;
};

export function DashboardStats({
  summary
}: DashboardStatsProps) {
  const coveragePercent =
    summary.totalProfessionCount === 0
      ? 0
      : Math.round(
          (
            summary.coveredProfessionCount /
            summary.totalProfessionCount
          ) * 100
        );

  return (
    <section className="stats-grid">
      <article className="stat-card">
        <span>Tracked Characters</span>
        <strong>
          {summary.characterCount}
        </strong>
        <small>
          across {summary.realmCount}{" "}
          {summary.realmCount === 1
            ? "realm"
            : "realms"}
        </small>
      </article>

      <article className="stat-card">
        <span>Crafting Ready</span>
        <strong>
          {
            summary
              .craftingReadyCharacterCount
          }
        </strong>
        <small>
          level{" "}
          {summary.minimumCraftingLevel}
          {" and above"}
        </small>
      </article>

      <article className="stat-card">
        <span>Synced</span>
        <strong>
          {summary.syncedCharacterCount}
        </strong>
        <small>
          characters with live data
        </small>
      </article>

      <article className="stat-card accent-card">
        <span>Coverage</span>
        <strong>
          {coveragePercent}%
        </strong>
        <small>
          {summary.coveredProfessionCount}
          {" of "}
          {summary.totalProfessionCount}
          {" professions covered"}
        </small>
      </article>
    </section>
  );
}
