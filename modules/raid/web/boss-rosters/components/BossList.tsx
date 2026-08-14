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
    <div className="boss-card-grid">
      {bosses.map((boss) => (
        <div
          className={
            boss.id === selectedBossId
              ? "boss-card selected"
              : "boss-card"
          }
          key={boss.id}
        >
          <button
            className="boss-card-select"
            onClick={() =>
              onSelect(boss.id)
            }
            type="button"
          >
            <span className="boss-card-name">
              {boss.name}
            </span>

            <div className="boss-card-stats">
              <span className="boss-card-stat confirmed">
                {countByStatus(
                  boss,
                  "CONFIRMED"
                )}{" "}
                confirmed
              </span>

              <span className="boss-card-stat tentative">
                {countByStatus(
                  boss,
                  "TENTATIVE"
                )}{" "}
                tentative
              </span>

              <span className="boss-card-stat bench">
                {countByStatus(
                  boss,
                  "BENCH"
                )}{" "}
                bench
              </span>
            </div>
          </button>

          <button
            className="text-button danger boss-card-delete"
            onClick={() =>
              onDelete(boss)
            }
            type="button"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
