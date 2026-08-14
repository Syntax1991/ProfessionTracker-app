import { Link } from "react-router-dom";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type {
  RaidBoss,
  RaidBossRosterStatus
} from "../types/bossRoster.types";

type BossRosterGridProps = {
  boss: RaidBoss;
  rosterMembers: GuildMember[];
  onSetStatus: (
    memberId: string,
    status: RaidBossRosterStatus
  ) => void;
  onClearStatus: (
    memberId: string
  ) => void;
};

const statuses: RaidBossRosterStatus[] =
  [
    "CONFIRMED",
    "TENTATIVE",
    "BENCH"
  ];

export function BossRosterGrid({
  boss,
  rosterMembers,
  onSetStatus,
  onClearStatus
}: BossRosterGridProps) {
  const entryByMemberId = new Map(
    boss.rosterEntries.map(
      (entry) => [
        entry.memberId,
        entry
      ]
    )
  );

  if (rosterMembers.length === 0) {
    return (
      <p className="muted-text">
        The guild roster is empty.{" "}
        <Link to="/guild/roster">
          Add guild members
        </Link>{" "}
        before planning a boss roster.
      </p>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>

        <tbody>
          {rosterMembers.map(
            (member) => {
              const entry =
                entryByMemberId.get(
                  member.id
                );

              return (
                <tr
                  key={member.id}
                >
                  <td>
                    {member.name}
                  </td>

                  <td>
                    <div className="attendance-status-buttons">
                      {statuses.map(
                        (
                          status
                        ) => (
                          <button
                            className={
                              entry?.status ===
                              status
                                ? "attendance-status-button selected"
                                : "attendance-status-button"
                            }
                            key={
                              status
                            }
                            onClick={() =>
                              onSetStatus(
                                member.id,
                                status
                              )
                            }
                            type="button"
                          >
                            {
                              status
                            }
                          </button>
                        )
                      )}
                    </div>
                  </td>

                  <td>
                    {entry && (
                      <button
                        className="text-button"
                        onClick={() =>
                          onClearStatus(
                            member.id
                          )
                        }
                        type="button"
                      >
                        Clear
                      </button>
                    )}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}
