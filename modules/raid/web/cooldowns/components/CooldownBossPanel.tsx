import { useState } from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import { BossMatrixMemberCell } from "../../boss-rosters/components/BossMatrixMemberCell";
import type { RaidCooldownAssignment, RaidCooldownAssignmentInput } from "../types/cooldown.types";
import { formatSeconds } from "../utils/timelineFormat";
import { CooldownAssignmentForm } from "./CooldownAssignmentForm";

type CooldownBossPanelProps = {
  bossId: string;
  bossName: string;
  assignments: RaidCooldownAssignment[];
  rosterMembers: GuildMember[];
  abilitySuggestions: string[];
  onAdd: (
    bossId: string,
    input: RaidCooldownAssignmentInput
  ) => Promise<void>;
  onRemove: (
    assignmentId: string
  ) => void;
};

export function CooldownBossPanel({
  bossId,
  bossName,
  assignments,
  rosterMembers,
  abilitySuggestions,
  onAdd,
  onRemove
}: CooldownBossPanelProps) {
  const [isAddFormOpen, setIsAddFormOpen] =
    useState(false);

  const memberById = new Map(
    rosterMembers.map((member) => [
      member.id,
      member
    ])
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            COOLDOWNS
          </p>

          <h2>{bossName}</h2>
        </div>

        <button
          className="button button-secondary"
          onClick={() =>
            setIsAddFormOpen(
              (current) => !current
            )
          }
          type="button"
        >
          {isAddFormOpen
            ? "Cancel"
            : "+ Add assignment"}
        </button>
      </div>

      {isAddFormOpen && (
        <CooldownAssignmentForm
          abilitySuggestions={
            abilitySuggestions
          }
          datalistId={`cooldown-abilities-${bossId}`}
          onSubmit={async (
            input
          ) => {
            await onAdd(
              bossId,
              input
            );

            setIsAddFormOpen(false);
          }}
          rosterMembers={
            rosterMembers
          }
        />
      )}

      {assignments.length === 0 ? (
        <p className="muted-text">
          No cooldowns assigned for
          this boss yet.
        </p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Ability</th>
                <th>Phase</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {assignments.map(
                (assignment) => {
                  const member =
                    memberById.get(
                      assignment.memberId
                    );

                  return (
                    <tr
                      key={
                        assignment.id
                      }
                    >
                      <td>
                        <BossMatrixMemberCell
                          className={
                            member?.className ??
                            "Unknown"
                          }
                          name={
                            member?.name ??
                            "Unknown"
                          }
                        />
                      </td>

                      <td>
                        {
                          assignment.abilityName
                        }
                      </td>

                      <td>
                        {assignment.phaseLabel ??
                          "—"}
                        {assignment.timestampSeconds !==
                          null && (
                          <span className="muted-text">
                            {" "}
                            (
                            {formatSeconds(
                              assignment.timestampSeconds
                            )}
                            )
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          aria-label="Remove assignment"
                          className="text-button danger"
                          onClick={() =>
                            onRemove(
                              assignment.id
                            )
                          }
                          type="button"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
