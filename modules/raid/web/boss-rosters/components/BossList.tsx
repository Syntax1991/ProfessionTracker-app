import type { RaidBoss } from "../types/bossRoster.types";

type BossListProps = {
  bosses: RaidBoss[];
  selectedBossId: string | null;
  onSelect: (
    bossId: string
  ) => void;
  onDelete: (
    boss: RaidBoss
  ) => void;
};

function countByStatus(
  boss: RaidBoss,
  status: string
): number {
  return boss.rosterEntries.filter(
    (entry) =>
      entry.status === status
  ).length;
}

export function BossList({
  bosses,
  selectedBossId,
  onSelect,
  onDelete
}: BossListProps) {
  if (bosses.length === 0) {
    return (
      <div className="empty-state">
        No bosses added yet.
      </div>
    );
  }

  return (
    <ul className="boss-list">
      {bosses.map((boss) => (
        <li key={boss.id}>
          <button
            className={
              boss.id ===
              selectedBossId
                ? "boss-list-button selected"
                : "boss-list-button"
            }
            onClick={() =>
              onSelect(boss.id)
            }
            type="button"
          >
            <strong>
              {boss.name}
            </strong>

            <span>
              {countByStatus(
                boss,
                "CONFIRMED"
              )}{" "}
              confirmed ·{" "}
              {countByStatus(
                boss,
                "TENTATIVE"
              )}{" "}
              tentative ·{" "}
              {countByStatus(
                boss,
                "BENCH"
              )}{" "}
              bench
            </span>
          </button>

          <button
            className="text-button danger"
            onClick={() =>
              onDelete(boss)
            }
            type="button"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
