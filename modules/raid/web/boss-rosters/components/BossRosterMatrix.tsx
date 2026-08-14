import { Fragment, useState } from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import {
  ROLE_LABELS,
  ROLE_ORDER,
  resolveRoleKey
} from "../../../../guild/web/roster/utils/rosterRoles";
import { BossMatrixMemberCell } from "./BossMatrixMemberCell";
import { BossMatrixStatusCell } from "./BossMatrixStatusCell";
import { BossForm } from "./BossForm";
import type {
  RaidBoss,
  RaidBossInput,
  RaidBossRosterStatus
} from "../types/bossRoster.types";
import type { RaidSignupEntry } from "../../signups/types/signup.types";

type BossRosterMatrixProps = {
  bosses: RaidBoss[];
  rosterMembers: GuildMember[];
  signupEntries: RaidSignupEntry[];
  onAddBoss: (
    input: RaidBossInput
  ) => Promise<void>;
  onDeleteBoss: (
    boss: RaidBoss
  ) => void;
  onSetStatus: (
    bossId: string,
    memberId: string,
    status: RaidBossRosterStatus
  ) => void;
  onClearStatus: (
    bossId: string,
    memberId: string
  ) => void;
};

const cycleOrder: Array<
  RaidBossRosterStatus | null
> = [
  null,
  "CONFIRMED",
  "TENTATIVE",
  "BENCH"
];

export function BossRosterMatrix({
  bosses,
  rosterMembers,
  signupEntries,
  onAddBoss,
  onDeleteBoss,
  onSetStatus,
  onClearStatus
}: BossRosterMatrixProps) {
  const [
    isAddFormOpen,
    setIsAddFormOpen
  ] = useState(false);

  const presentMemberIds = new Set(
    signupEntries
      .filter(
        (entry) =>
          entry.status ===
          "PRESENT"
      )
      .map(
        (entry) =>
          entry.member.id
      )
  );

  const handleCellClick = (
    boss: RaidBoss,
    memberId: string,
    currentStatus:
      | RaidBossRosterStatus
      | null
  ) => {
    const currentIndex =
      cycleOrder.indexOf(
        currentStatus
      );

    const nextStatus =
      cycleOrder[
        (currentIndex + 1) %
          cycleOrder.length
      ];

    if (nextStatus === null) {
      onClearStatus(
        boss.id,
        memberId
      );

      return;
    }

    onSetStatus(
      boss.id,
      memberId,
      nextStatus
    );
  };

  if (rosterMembers.length === 0) {
    return (
      <p className="muted-text">
        The guild roster is empty.
      </p>
    );
  }

  const groupedMembers = ROLE_ORDER.map(
    (roleKey) => ({
      roleKey,
      members:
        rosterMembers.filter(
          (member) =>
            resolveRoleKey(
              member.role
            ) === roleKey
        )
    })
  ).filter(
    (group) =>
      group.members.length > 0
  );

  return (
    <div>
      <div className="boss-matrix-toolbar">
        <button
          className="button button-secondary"
          onClick={() =>
            setIsAddFormOpen(
              (current) =>
                !current
            )
          }
          type="button"
        >
          {isAddFormOpen
            ? "Cancel"
            : "+ Add boss"}
        </button>
      </div>

      {isAddFormOpen && (
        <BossForm
          onSubmit={async (
            input
          ) => {
            await onAddBoss(
              input
            );

            setIsAddFormOpen(
              false
            );
          }}
        />
      )}

      {bosses.length === 0 ? (
        <p className="muted-text">
          No bosses yet. Pick a
          catalog raid instance
          when scheduling to
          auto-fill encounters, or
          add one above.
        </p>
      ) : (
        <div className="table-scroll">
          <table className="boss-matrix-table">
            <thead>
              <tr>
                <th>Member</th>

                {bosses.map(
                  (boss) => (
                    <th
                      key={boss.id}
                    >
                      <div className="boss-matrix-column-header">
                        <span>
                          {boss.name}
                        </span>

                        <button
                          aria-label={`Delete ${boss.name}`}
                          className="text-button danger"
                          onClick={() =>
                            onDeleteBoss(
                              boss
                            )
                          }
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {groupedMembers.map(
                (group) => (
                  <Fragment
                    key={
                      group.roleKey
                    }
                  >
                    <tr>
                      <td
                        className="boss-matrix-role-header"
                        colSpan={
                          bosses.length +
                          1
                        }
                      >
                        {
                          ROLE_LABELS[
                            group
                              .roleKey
                          ]
                        }{" "}
                        (
                        {
                          group
                            .members
                            .length
                        }
                        )
                      </td>
                    </tr>

                    {group.members.map(
                      (member) => (
                        <tr
                          key={
                            member.id
                          }
                        >
                          <td>
                            <BossMatrixMemberCell
                              className={
                                member.className
                              }
                              name={
                                member.name
                              }
                            />
                          </td>

                          {bosses.map(
                            (
                              boss
                            ) => {
                              const entry =
                                boss.rosterEntries.find(
                                  (
                                    candidate
                                  ) =>
                                    candidate.memberId ===
                                    member.id
                                );

                              const savedStatus =
                                entry?.status ??
                                null;

                              const isSuggested =
                                !savedStatus &&
                                presentMemberIds.has(
                                  member.id
                                );

                              const displayStatus:
                                | RaidBossRosterStatus
                                | null =
                                savedStatus ??
                                (isSuggested
                                  ? "CONFIRMED"
                                  : null);

                              return (
                                <BossMatrixStatusCell
                                  displayStatus={
                                    displayStatus
                                  }
                                  isSuggested={
                                    isSuggested
                                  }
                                  key={
                                    boss.id
                                  }
                                  onClick={() =>
                                    handleCellClick(
                                      boss,
                                      member.id,
                                      displayStatus
                                    )
                                  }
                                />
                              );
                            }
                          )}
                        </tr>
                      )
                    )}
                  </Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
