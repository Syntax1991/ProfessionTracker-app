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
        <span>Characters</span>
        <strong>
          {summary.characterCount}
        </strong>
        <small>
          entire crafter roster
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
          ab Level{" "}
          {summary.minimumCraftingLevel}
        </small>
      </article>

      <article className="stat-card">
        <span>Profession Slots</span>
        <strong>
          {
            summary
              .professionAssignmentCount
          }
        </strong>
        <small>
          current assignments
        </small>
      </article>

      <article className="stat-card accent-card">
        <span>Coverage</span>
        <strong>
          {coveragePercent}%
        </strong>
        <small>
          {summary.coveredProfessionCount}
          {" von "}
          {summary.totalProfessionCount}
          {" Professionsn"}
        </small>
      </article>
    </section>
  );
}