import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { GuildVerificationGate } from "../../../../guild/web/verification/components/GuildVerificationGate";
import { useRaidEvents } from "../../planner/hooks/useRaidEvents";
import { MySignupCard } from "../components/MySignupCard";
import { SignupOfficerGrid } from "../components/SignupOfficerGrid";
import { useSignups } from "../hooks/useSignups";

export function SignupsPage() {
  const [
    selectedEventId,
    setSelectedEventId
  ] = useState<string | null>(
    null
  );

  const {
    events,
    isLoading: isLoadingEvents
  } = useRaidEvents();

  const {
    entries,
    isLoading: isLoadingEntries,
    isSubmitting,
    error,
    setMemberStatus,
    setOwnStatus,
    clearMemberStatus
  } = useSignups(selectedEventId);

  return (
    <>
      <PageHeader
        description="Sign yourself up for a scheduled raid, or manage everyone's signups as an officer."
        eyebrow="RAID"
        title="Signups"
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
              RAID
            </p>

            <h2>
              Select a scheduled
              raid
            </h2>
          </div>
        </div>

        {isLoadingEvents ? (
          <LoadingPanel />
        ) : events.length === 0 ? (
          <p className="muted-text">
            No raids scheduled yet.
            Schedule one on the Raid
            Planner page first.
          </p>
        ) : (
          <select
            onChange={(event) =>
              setSelectedEventId(
                event.target
                  .value || null
              )
            }
            value={
              selectedEventId ?? ""
            }
          >
            <option value="">
              Select a raid…
            </option>

            {events.map(
              (event) => (
                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.title} (
                  {new Date(
                    event.scheduledAt
                  ).toLocaleDateString()}
                  )
                </option>
              )
            )}
          </select>
        )}
      </section>

      {selectedEventId && (
        <>
          <MySignupCard
            entries={entries}
            isSubmitting={
              isSubmitting
            }
            onSetOwnStatus={(
              status
            ) => {
              void setOwnStatus(
                status
              );
            }}
          />

          <GuildVerificationGate>
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">
                    OFFICER OVERVIEW
                  </p>

                  <h2>
                    {
                      entries.filter(
                        (entry) =>
                          entry.status !==
                          null
                      ).length
                    }{" "}
                    of {entries.length}{" "}
                    signed up
                  </h2>
                </div>
              </div>

              {isLoadingEntries ? (
                <LoadingPanel />
              ) : (
                <SignupOfficerGrid
                  entries={entries}
                  onClear={(
                    memberId
                  ) => {
                    void clearMemberStatus(
                      memberId
                    );
                  }}
                  onSetStatus={(
                    memberId,
                    status
                  ) => {
                    void setMemberStatus(
                      memberId,
                      status
                    );
                  }}
                />
              )}
            </section>
          </GuildVerificationGate>
        </>
      )}
    </>
  );
}
