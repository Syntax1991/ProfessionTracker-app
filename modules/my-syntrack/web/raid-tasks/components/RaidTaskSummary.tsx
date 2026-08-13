import type { RaidTaskOverview } from "../types/raidTask.types";

type RaidTaskSummaryProps = {
  overview: RaidTaskOverview;
};

export function RaidTaskSummary({
  overview
}: RaidTaskSummaryProps) {
  const completionPercent =
    overview.summary.totalTaskCount === 0
      ? 0
      : Math.round(
          (
            overview.summary
              .completedTaskCount /
            overview.summary.totalTaskCount
          ) * 100
        );

  return (
    <section className="raid-task-summary-grid">
      <article className="raid-task-summary-card">
        <span>Raid tasks</span>
        <strong>
          {overview.summary.totalTaskCount}
        </strong>
        <small>across your roster</small>
      </article>

      <article className="raid-task-summary-card raid-task-summary-open">
        <span>Open</span>
        <strong>
          {overview.summary.openTaskCount}
        </strong>
        <small>still need attention</small>
      </article>

      <article className="raid-task-summary-card raid-task-summary-urgent">
        <span>Due soon</span>
        <strong>
          {overview.summary.dueSoonTaskCount}
        </strong>
        <small>due within 48 hours</small>
      </article>

      <article className="raid-task-summary-card raid-task-summary-progress">
        <span>Readiness</span>
        <strong>{completionPercent}%</strong>
        <small>
          {overview.summary.completedTaskCount}
          {" completed"}
        </small>
      </article>
    </section>
  );
}
