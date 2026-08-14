import { Fragment, useState } from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import {
  ROLE_LABELS,
  ROLE_ORDER,
  resolveRoleKey
} from "../../../../guild/web/roster/utils/rosterRoles";
import { BossForm } from "./BossForm";
import type {
  RaidBoss,
  RaidBossInput,
  RaidBossRosterStatus
} from "../types/bossRoster.types";

type BossRosterMatrixProps = {
  bosses: RaidBoss[];
  rosterMembers: GuildMember[];
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

const cellLabel: Record<
  RaidBossRosterStatus,
  string
> = {
  CONFIRMED: "✓",
  TENTATIVE: "?",
  BENCH: "B"
};

const cellBadgeClass: Record<
  RaidBossRosterStatus,
  string
> = {
  CONFIRMED:
    "boss-matrix-badge confirmed",
  TENTATIVE:
    "boss-matrix-badge tentative",
  BENCH: "boss-matrix-badge bench"
};

export function BossRosterMatrix({
  bosses,
  rosterMembers,
  onAddBoss,
  onDeleteBoss,
  onSetStatus,
  onClearStatus
}: BossRosterMatrixProps) {
  const [
    isAddFormOpen,
    setIsAddFormOpen
  ] = useState(false);

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
                            <div className="character-identity boss-matrix-member">
                              <div className="character-avatar">
                                {member.name
                                  .slice(
                                    0,
                                    2
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {
                                    member.name
                                  }
                                </strong>

                                <span>
                                  {
                                    member.className
                                  }
                                </span>
                              </div>
                            </div>
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

                              const status =
                                entry?.status ??
                                null;

                              return (
                                <td
                                  className="boss-matrix-cell"
                                  key={
                                    boss.id
                                  }
                                  onClick={() =>
                                    handleCellClick(
                                      boss,
                                      member.id,
                                      status
                                    )
                                  }
                                  role="button"
                                  tabIndex={
                                    0
                                  }
                                >
                                  <span
                                    className={
                                      status
                                        ? cellBadgeClass[
                                            status
                                          ]
                                        : "boss-matrix-badge empty"
                                    }
                                  >
                                    {status
                                      ? cellLabel[
                                          status
                                        ]
                                      : "–"}
                                  </span>
                                </td>
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
