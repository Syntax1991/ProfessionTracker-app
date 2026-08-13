import type { WeeklyChecklistResponse } from "../types/weeklyChecklist.types";

type WeeklySummaryStatsProps = {
  checklist: WeeklyChecklistResponse;
};

function formatResetDate(endsAt: string) {
  return new Intl.DateTimeFormat(
    "en",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(new Date(endsAt));
}

export function WeeklySummaryStats({
  checklist
}: WeeklySummaryStatsProps) {
  const completionPercent =
    checklist.summary.totalTaskCount === 0
      ? 0
      : Math.round(
          (
            checklist.summary.completedTaskCount /
            checklist.summary.totalTaskCount
          ) * 100
        );

  return (
    <section className="weekly-summary-grid">
      <article className="weekly-summary-card">
        <span>Roster</span>
        <strong>
          {checklist.characters.length}
        </strong>
        <small>tracked characters</small>
      </article>

      <article className="weekly-summary-card">
        <span>Finished</span>
        <strong>
          {
            checklist.summary
              .completedCharacterCount
          }
        </strong>
        <small>
          characters fully ready
        </small>
      </article>

      <article className="weekly-summary-card weekly-summary-progress">
        <span>Overall progress</span>
        <strong>{completionPercent}%</strong>
        <small>
          {checklist.summary.completedTaskCount}
          {" / "}
          {checklist.summary.totalTaskCount}
          {" tasks"}
        </small>
      </article>

      <article className="weekly-summary-card weekly-summary-reset">
        <span>Next reset</span>
        <strong>
          {formatResetDate(
            checklist.period.endsAt
          )}
        </strong>
        <small>weekly tracking period</small>
      </article>
    </section>
  );
}
