import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { WeeklyProgressTable } from "../components/WeeklyProgressTable";
import { useWeeklyProgress } from "../hooks/useWeeklyProgress";

export function WeeklyProgressPage() {
  const {
    summary,
    isLoading,
    error
  } = useWeeklyProgress();

  return (
    <div className="guild-page">
      <PageHeader
        description="See who is keeping up with the current weekly preparation cycle."
        eyebrow="GUILD"
        title="Weekly Progress"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <div className="guild-section-toolbar">
          <div>
            <span className="eyebrow">
              WEEKLY
            </span>

            <h2>
              {summary
                ? `Period ${summary.periodKey}`
                : "Current Period"}
            </h2>
          </div>
        </div>

        <section className="panel guild-content-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                PROGRESS
              </p>

              <h2>
                Raider Preparation
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

        <p className="guild-page-footnote">
          Members appear as
          &quot;not tracked&quot; when
          their roster identity cannot
          be matched to My SynTrack.
        </p>
      </GuildVerificationGate>
    </div>
  );
}