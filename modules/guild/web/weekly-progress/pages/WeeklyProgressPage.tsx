import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { WeeklyProgressTable } from "../components/WeeklyProgressTable";
import { useWeeklyProgress } from "../hooks/useWeeklyProgress";

export function WeeklyProgressPage() {
  const {
    summary,
    isLoading,
    error
  } = useWeeklyProgress();

  return (
    <>
      <PageHeader
        description="See which guild members are keeping up with their weekly checklist and Mythic+ runs, matched against My SynTrack by character identity."
        eyebrow="GUILD"
        title="Weekly Progress"
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              OVERVIEW
            </p>

            <h2>
              {summary
                ? `Period starting ${summary.periodKey}`
                : "Weekly Progress"}
            </h2>
          </div>
        </div>

        {isLoading || !summary ? (
          <LoadingPanel />
        ) : (
          <WeeklyProgressTable
            items={summary.items}
          />
        )}
      </section>

      <p className="muted-text">
        Members show as &quot;not tracked&quot; when no My SynTrack
        character matches their roster name, realm and region exactly.
      </p>
    </>
  );
}
