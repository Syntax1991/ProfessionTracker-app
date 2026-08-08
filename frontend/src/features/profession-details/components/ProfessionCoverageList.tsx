import type {
  ProfessionCoverageEntry
} from "../types/professionDetail.types";

type ProfessionCoverageListProps = {
  title: string;
  emptyText: string;
  entries:
    ProfessionCoverageEntry[];
};

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
                <strong>
                  {entry.name}
                </strong>

                <div className="profession-detail-entry-meta">
                  <span>
                    {entry.source}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}