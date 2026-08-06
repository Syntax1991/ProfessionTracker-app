import { Link } from "react-router-dom";
import type { ProfessionCharacterCoverage } from "../types/professionDetail.types";
import { ProfessionCoverageList } from "./ProfessionCoverageList";

type ProfessionCharacterCardProps = {
  coverage:
    ProfessionCharacterCoverage;
};

const statusLabels = {
  TRACKED:
    "Slots erfasst",
  PARTIAL:
    "Teilweise erfasst",
  UNTRACKED:
    "Nicht erfasst",
  NO_CATALOG:
    "Kein Katalog"
} as const;

export function ProfessionCharacterCard({
  coverage
}: ProfessionCharacterCardProps) {
  return (
    <article className="panel profession-character-card">
      <header className="profession-character-card-header">
        <div className="profession-character-identity">
          <div className="character-avatar">
            {coverage.character.name
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h3>
              {coverage.character.name}
            </h3>

            <p>
              {coverage.character.className}
              {" · "}
              {coverage.character.realm}
              {" · Level "}
              {coverage.character.level}
            </p>
          </div>
        </div>

        <div className="profession-character-header-actions">
          <span
            className={
              `profession-data-status ${coverage.dataStatus.toLowerCase()}`
            }
          >
            {
              statusLabels[
                coverage.dataStatus
              ]
            }
          </span>

          <Link
            className="text-button"
            to={
              `/characters/${coverage.character.id}`
            }
          >
            Charakterdetails
          </Link>
        </div>
      </header>

      <div className="profession-character-stats">
        <div>
          <span>Berufsskill</span>

          <strong>
            {coverage.skill}
          </strong>
        </div>

        <div>
          <span>Wissenspunkte</span>

          <strong>
            {coverage.knowledgePoints}
          </strong>
        </div>

        <div>
          <span>Spezialisierungen</span>

          <strong>
            {
              coverage
                .specializations
                .length
            }
          </strong>
        </div>

        <div>
          <span>Slots</span>

          <strong>
            {coverage.slots.length}
          </strong>
        </div>
      </div>

      {coverage.specializationSummary && (
        <div className="profession-character-api-summary">
          <span>
            Battle.net
          </span>

          <p>
            {
              coverage
                .specializationSummary
            }
          </p>
        </div>
      )}

      <div className="profession-character-coverage-grid">
        <ProfessionCoverageList
          emptyText="Für diesen Charakter ist noch keine Spezialisierung ausgewählt."
          entries={
            coverage.specializations
          }
          title="Spezialisierungen"
        />

        <ProfessionCoverageList
          emptyText="Für diesen Charakter sind noch keine herstellbaren Slots erfasst."
          entries={
            coverage.slots
          }
          title="Herstellbare Slots"
        />
      </div>
    </article>
  );
}