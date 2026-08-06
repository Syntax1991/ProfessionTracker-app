import type { ProfessionCoverageEntry } from "../types/professionDetail.types";

type ProfessionCoverageListProps = {
  title: string;
  emptyText: string;
  entries: ProfessionCoverageEntry[];
};

function formatRank(
  entry: ProfessionCoverageEntry
): string {
  if (entry.maxRank === null) {
    return `Rang ${entry.rank}`;
  }

  return `${entry.rank}/${entry.maxRank}`;
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
                <div>
                  <strong>
                    {entry.name}
                  </strong>

                  <small>
                    {entry.path}
                  </small>
                </div>

                <div className="profession-detail-entry-meta">
                  <span>
                    {entry.source}
                  </span>

                  <strong>
                    {formatRank(
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