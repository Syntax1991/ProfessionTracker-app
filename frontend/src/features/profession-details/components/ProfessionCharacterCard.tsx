import { Link } from "react-router-dom";
import type {
  ProfessionCharacterCoverage
} from "../types/professionDetail.types";
import {
  ProfessionCapabilityList
} from "./ProfessionCapabilityList";
import {
  ProfessionCoverageList
} from "./ProfessionCoverageList";

type ProfessionCharacterCardProps = {
  coverage:
    ProfessionCharacterCoverage;
};

const statusLabels = {
  TRACKED:
    "Daten erfasst",

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
          <span>
            Berufsskill
          </span>

          <strong>
            {coverage.skill}
          </strong>
        </div>

        <div>
          <span>
            Wissenspunkte
          </span>

          <strong>
            {coverage.knowledgePoints}
          </strong>
        </div>

        <div>
          <span>
            Fähigkeiten
          </span>

          <strong>
            {
              coverage
                .capabilities
                .length
            }
          </strong>
        </div>

        <div>
          <span>
            Gelernte Rezepte
          </span>

          <strong>
            {
              coverage
                .recipes
                .length
            }
          </strong>
        </div>
      </div>

      <div className="profession-character-coverage-grid">
        <ProfessionCapabilityList
          capabilities={
            coverage.capabilities
          }
        />

        <ProfessionCoverageList
          emptyText="Für diesen Charakter wurden noch keine tatsächlichen Equipment-Slots erkannt."
          entries={
            coverage.slots
          }
          title="Equipment-Slots"
        />
      </div>
    </article>
  );
}