import type {
  ProfessionCoverageEntry
} from "../types/professionDetail.types";

type ProfessionCoverageListProps = {
  title: string;
  emptyText: string;
  entries:
    ProfessionCoverageEntry[];
};

function formatPoints(
  entry:
    ProfessionCoverageEntry
): string {
  if (
    entry.maxSkillPoints ===
    null
  ) {
    return `${entry.skillPoints}`;
  }

  return (
    `${entry.skillPoints}/${entry.maxSkillPoints}`
  );
}

export function ProfessionCoverageList({
  title,
  emptyText,
  entries
}: ProfessionCoverageListProps) {
  return (
    <section className="profession-detail-coverage-section">
      <header>
        <h4>
          {title}
        </h4>

        <span>
          {entries.length}
        </span>
      </header>

      {entries.length === 0 ? (
        <div className="profession-detail-empty-list">
          {emptyText}
        </div>
      ) : (
        <ul>
          {entries.map(
            (entry) => (
              <li key={entry.id}>
                <div className="profession-slot-name">
                  <strong>
                    {entry.name}
                  </strong>

                  <small>
                    {entry.unlocked
                      ? "Unlocked"
                      : "Not unlocked"}
                  </small>
                </div>

                <div className="profession-detail-entry-meta">
                  <span>
                    {entry.source}
                  </span>

                  <strong className="profession-slot-points">
                    {formatPoints(
                      entry
                    )}
                  </strong>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}