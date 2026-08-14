import type { GuildMember } from "../types/roster.types";
import {
  ARMOR_TYPE_ORDER,
  ROLE_LABELS,
  ROLE_ORDER
} from "../utils/rosterRoles";
import { computeRosterSummary } from "../utils/rosterSummary";

type RosterSummarySidebarProps = {
  members: GuildMember[];
};

export function RosterSummarySidebar({
  members
}: RosterSummarySidebarProps) {
  const summary =
    computeRosterSummary(members);

  return (
    <aside className="panel roster-summary-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            RAID SUMMARY
          </p>

          <h2>
            {summary.totalMembers}{" "}
            Members
          </h2>
        </div>
      </div>

      <div className="roster-summary-section">
        <h3>Composition</h3>

        <ul className="roster-summary-role-list">
          {ROLE_ORDER.map((roleKey) => (
            <li
              className="roster-summary-role-row"
              key={roleKey}
            >
              <span>
                {ROLE_LABELS[roleKey]}
              </span>

              <span className="roster-summary-count">
                {
                  summary.roleCounts[
                    roleKey
                  ]
                }
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="roster-summary-section">
        <h3>Average Item Level</h3>

        {summary.averageItemLevel !==
        null ? (
          <>
            <p className="roster-summary-stat">
              {Math.round(
                summary.averageItemLevel
              )}
            </p>

            <span className="roster-summary-caption">
              {summary.auditedMemberCount}{" "}
              of {summary.totalMembers}{" "}
              members audited
            </span>
          </>
        ) : (
          <span className="muted-text">
            No audit data yet.
          </span>
        )}
      </div>

      <div className="roster-summary-section">
        <h3>Armor Breakdown</h3>

        <ul className="roster-summary-armor-list">
          {ARMOR_TYPE_ORDER.filter(
            (armorType) =>
              summary.armorCounts[
                armorType
              ] > 0
          ).map((armorType) => {
            const count =
              summary.armorCounts[
                armorType
              ];

            const percent =
              summary.totalMembers > 0
                ? Math.round(
                    (count /
                      summary.totalMembers) *
                      100
                  )
                : 0;

            return (
              <li
                className="roster-summary-armor-row"
                key={armorType}
              >
                <div className="roster-summary-armor-label">
                  <span>{armorType}</span>
                  <span className="roster-summary-count">
                    {count}
                  </span>
                </div>

                <div className="roster-summary-bar">
                  <div
                    className="roster-summary-bar-fill"
                    style={{
                      width: `${percent}%`
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
