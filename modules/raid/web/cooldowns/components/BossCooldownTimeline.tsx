import {
  useState,
  type FormEvent
} from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import {
  getAbilitiesForBoss,
  groupAbilitiesByPhase
} from "../../../shared/catalog/bossAbilityCatalog";
import { usePhaseMarkers } from "../hooks/usePhaseMarkers";
import type {
  RaidCooldownAssignment,
  RaidCooldownAssignmentInput
} from "../types/cooldown.types";
import {
  formatSeconds,
  parseTimeInput
} from "../utils/timelineFormat";
import { CooldownAssignmentForm } from "./CooldownAssignmentForm";
import { TimelineTrack } from "./TimelineTrack";

type BossCooldownTimelineProps = {
  bossId: string;
  bossName: string;
  fightDurationSeconds: number | null;
  assignments: RaidCooldownAssignment[];
  rosterMembers: GuildMember[];
  onUpdateDuration: (
    seconds: number | null
  ) => Promise<void>;
  onAddAssignment: (
    bossId: string,
    input: RaidCooldownAssignmentInput
  ) => Promise<void>;
  onRemoveAssignment: (
    assignmentId: string
  ) => void;
};

export function BossCooldownTimeline({
  bossId,
  bossName,
  fightDurationSeconds,
  assignments,
  rosterMembers,
  onUpdateDuration,
  onAddAssignment,
  onRemoveAssignment
}: BossCooldownTimelineProps) {
  const phaseMarkers =
    usePhaseMarkers(bossId);

  const [durationInput, setDurationInput] =
    useState(
      fightDurationSeconds !== null
        ? formatSeconds(
            fightDurationSeconds
          )
        : ""
    );

  const [phaseLabelInput, setPhaseLabelInput] =
    useState("");

  const [phaseTimeInput, setPhaseTimeInput] =
    useState("");

  const [
    pendingTimestampSeconds,
    setPendingTimestampSeconds
  ] = useState<number | null>(null);

  const memberById = new Map(
    rosterMembers.map((member) => [
      member.id,
      member
    ])
  );

  const abilityGroups =
    groupAbilitiesByPhase(
      getAbilitiesForBoss(bossName)
    );

  const abilitySuggestions =
    Array.from(
      new Set(
        assignments.map(
          (assignment) =>
            assignment.abilityName
        )
      )
    ).sort();

  const handleDurationSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await onUpdateDuration(
      parseTimeInput(durationInput)
    );
  };

  const handlePhaseSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const startSeconds = parseTimeInput(
      phaseTimeInput
    );

    if (
      !phaseLabelInput.trim() ||
      startSeconds === null
    ) {
      return;
    }

    await phaseMarkers.addMarker({
      label: phaseLabelInput.trim(),
      startSeconds,
      sortOrder: 0
    });

    setPhaseLabelInput("");
    setPhaseTimeInput("");
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            TIMELINE
          </p>

          <h2>{bossName}</h2>
        </div>

        <form
          className="cooldown-duration-form"
          onSubmit={
            handleDurationSubmit
          }
        >
          <input
            onChange={(event) =>
              setDurationInput(
                event.target.value
              )
            }
            placeholder="mm:ss"
            value={durationInput}
          />

          <button
            className="button button-secondary"
            type="submit"
          >
            Set duration
          </button>
        </form>
      </div>

      {abilityGroups.length > 0 && (
        <div className="cooldown-ability-legend">
          {abilityGroups.map(
            (group) => (
              <div key={group.phase}>
                <span className="cooldown-ability-legend-phase">
                  {group.phase}
                </span>

                <div>
                  {group.abilities.map(
                    (ability) => (
                      <span
                        key={
                          ability.name
                        }
                      >
                        {
                          ability.name
                        }
                      </span>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {fightDurationSeconds ===
      null ? (
        <p className="muted-text">
          Set a fight duration above
          to start placing cooldowns
          on the timeline.
        </p>
      ) : (
        <>
          <form
            className="boss-add-form"
            onSubmit={
              handlePhaseSubmit
            }
          >
            <input
              maxLength={60}
              onChange={(event) =>
                setPhaseLabelInput(
                  event.target
                    .value
                )
              }
              placeholder="Phase label (e.g. Intermission)"
              value={
                phaseLabelInput
              }
            />

            <input
              onChange={(event) =>
                setPhaseTimeInput(
                  event.target
                    .value
                )
              }
              placeholder="mm:ss"
              value={
                phaseTimeInput
              }
            />

            <button
              className="button button-secondary"
              type="submit"
            >
              + Add phase marker
            </button>
          </form>

          <TimelineTrack
            assignments={
              assignments
            }
            fightDurationSeconds={
              fightDurationSeconds
            }
            memberById={memberById}
            onRemoveAssignment={
              onRemoveAssignment
            }
            onRemovePhaseMarker={(
              markerId
            ) => {
              void phaseMarkers.removeMarker(
                markerId
              );
            }}
            onTrackClick={(
              seconds
            ) =>
              setPendingTimestampSeconds(
                seconds
              )
            }
            phaseMarkers={
              phaseMarkers.markers
            }
          />

          {pendingTimestampSeconds !==
            null && (
            <>
              <CooldownAssignmentForm
                abilitySuggestions={
                  abilitySuggestions
                }
                datalistId={`cooldown-timeline-abilities-${bossId}`}
                initialTimestampSeconds={
                  pendingTimestampSeconds
                }
                onSubmit={async (
                  input
                ) => {
                  await onAddAssignment(
                    bossId,
                    input
                  );

                  setPendingTimestampSeconds(
                    null
                  );
                }}
                rosterMembers={
                  rosterMembers
                }
              />

              <button
                className="text-button"
                onClick={() =>
                  setPendingTimestampSeconds(
                    null
                  )
                }
                type="button"
              >
                Cancel
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
}
