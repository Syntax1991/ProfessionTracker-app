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
        <span>Charaktere</span>
        <strong>
          {summary.characterCount}
        </strong>
        <small>
          gesamte Crafter-Flotte
        </small>
      </article>

      <article className="stat-card">
        <span>Crafting-bereit</span>
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
        <span>Berufsslots</span>
        <strong>
          {
            summary
              .professionAssignmentCount
          }
        </strong>
        <small>
          aktuelle Zuweisungen
        </small>
      </article>

      <article className="stat-card accent-card">
        <span>Abdeckung</span>
        <strong>
          {coveragePercent}%
        </strong>
        <small>
          {summary.coveredProfessionCount}
          {" von "}
          {summary.totalProfessionCount}
          {" Berufen"}
        </small>
      </article>
    </section>
  );
}