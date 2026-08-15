import type { RaidBoss } from "../types/bossRoster.types";

type BossMatrixFooterProps = {
  bosses: RaidBoss[];
  poolMemberIds: Set<string>;
};

export function BossMatrixFooter({
  bosses,
  poolMemberIds
}: BossMatrixFooterProps) {
  return (
    <tfoot>
      <tr>
        <td className="boss-matrix-role-header">
          Confirmed
        </td>

        {bosses.map((boss) => {
          const confirmedCount =
            boss.rosterEntries.filter(
              (entry) =>
                entry.status ===
                  "CONFIRMED" &&
                poolMemberIds.has(
                  entry.memberId
                )
            ).length;

          return (
            <td
              key={boss.id}
              className="boss-matrix-role-header"
            >
              {confirmedCount}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
}
