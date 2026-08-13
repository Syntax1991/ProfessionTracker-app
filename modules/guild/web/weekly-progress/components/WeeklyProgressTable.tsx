import type { GuildWeeklyProgressEntry } from "../types/weeklyProgress.types";

type WeeklyProgressTableProps = {
  items: GuildWeeklyProgressEntry[];
};

export function WeeklyProgressTable({
  items
}: WeeklyProgressTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        No guild members yet.
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Tracked</th>
            <th>Weekly Checklist</th>
            <th>M+ Runs</th>
            <th>Best Keystone</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.memberId}>
              <td>
                <strong>
                  {item.name}
                </strong>

                <span className="guild-note">
                  {" "}
                  {item.className}
                  {" · "}
                  {item.rank}
                </span>
              </td>

              <td>
                {item.tracked ? (
                  <span className="source-badge addon">
                    MY SYNTRACK
                  </span>
                ) : (
                  <span className="source-badge manual">
                    NOT TRACKED
                  </span>
                )}
              </td>

              <td>
                {item.tracked
                  ? `${item.completedTaskCount}/${item.totalTaskCount}`
                  : "—"}
              </td>

              <td>
                {item.tracked
                  ? item.mythicPlusRunCount
                  : "—"}
              </td>

              <td>
                {item.bestKeystoneLevel ??
                  "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
