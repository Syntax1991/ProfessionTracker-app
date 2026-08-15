import type { RaidBoss } from "../types/bossRoster.types";

type BossMatrixHeaderProps = {
  bosses: RaidBoss[];
  onDeleteBoss: (boss: RaidBoss) => void;
};

export function BossMatrixHeader({
  bosses,
  onDeleteBoss
}: BossMatrixHeaderProps) {
  return (
    <thead>
      <tr>
        <th>Member</th>

        {bosses.map((boss) => (
          <th key={boss.id}>
            <div className="boss-matrix-column-header">
              <span>{boss.name}</span>

              <button
                aria-label={`Delete ${boss.name}`}
                className="text-button danger"
                onClick={() =>
                  onDeleteBoss(boss)
                }
                type="button"
              >
                ×
              </button>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
