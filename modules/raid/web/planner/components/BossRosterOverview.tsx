import { BossMatrixMemberCell } from "../../boss-rosters/components/BossMatrixMemberCell";
import {
  ROLE_LABELS,
  ROLE_ORDER,
  resolveRoleKey
} from "../../../../guild/web/roster/utils/rosterRoles";
import type { RaidSignupEntry } from "../../signups/types/signup.types";

type BossRosterOverviewProps = {
  entries: RaidSignupEntry[];
};

export function BossRosterOverview({
  entries
}: BossRosterOverviewProps) {
  if (entries.length === 0) {
    return (
      <p className="muted-text">
        No guild members yet.
      </p>
    );
  }

  const groups = ROLE_ORDER.map(
    (roleKey) => {
      const roleEntries =
        entries.filter(
          (entry) =>
            resolveRoleKey(
              entry.member.role
            ) === roleKey
        );

      return {
        roleKey,
        total:
          roleEntries.length,
        selected:
          roleEntries.filter(
            (entry) =>
              entry.status ===
              "PRESENT"
          ),
        benched:
          roleEntries.filter(
            (entry) =>
              entry.status !==
              "PRESENT"
          )
      };
    }
  ).filter(
    (group) => group.total > 0
  );

  return (
    <div className="boss-overview-grid">
      {groups.map((group) => (
        <div
          className="panel boss-overview-column"
          key={group.roleKey}
        >
          <div className="boss-overview-column-header">
            <span>
              {
                ROLE_LABELS[
                  group.roleKey
                ]
              }
            </span>

            <strong>
              {group.total}
            </strong>
          </div>

          {group.selected.length >
            0 && (
            <div className="boss-overview-subgroup">
              <p className="boss-overview-subgroup-label">
                Selected
              </p>

              {group.selected.map(
                (entry) => (
                  <div
                    className="boss-overview-row"
                    key={
                      entry.member
                        .id
                    }
                  >
                    <BossMatrixMemberCell
                      className={
                        entry
                          .member
                          .className
                      }
                      name={
                        entry
                          .member
                          .name
                      }
                    />

                    <span className="boss-overview-status confirmed">
                      ✓
                    </span>
                  </div>
                )
              )}
            </div>
          )}

          {group.benched.length >
            0 && (
            <div className="boss-overview-subgroup">
              <p className="boss-overview-subgroup-label">
                Benched
              </p>

              {group.benched.map(
                (entry) => (
                  <div
                    className="boss-overview-row"
                    key={
                      entry.member
                        .id
                    }
                  >
                    <BossMatrixMemberCell
                      className={
                        entry
                          .member
                          .className
                      }
                      name={
                        entry
                          .member
                          .name
                      }
                    />

                    <span className="boss-overview-status absent">
                      ✕
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
