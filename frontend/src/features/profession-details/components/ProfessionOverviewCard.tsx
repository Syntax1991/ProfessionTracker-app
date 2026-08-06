import { Link } from "react-router-dom";
import type { ProfessionOverviewItem } from "../types/professionDetail.types";

type ProfessionOverviewCardProps = {
  profession:
    ProfessionOverviewItem;
};

function getCategoryLabel(
  category: string
): string {
  return category === "GATHERING"
    ? "Sammelberuf"
    : "Herstellungsberuf";
}

export function ProfessionOverviewCard({
  profession
}: ProfessionOverviewCardProps) {
  return (
    <Link
      className="profession-overview-card"
      to={
        `/professions/${profession.id}`
      }
    >
      <div className="profession-overview-card-header">
        <div>
          <span>
            {getCategoryLabel(
              profession.category
            )}
          </span>

          <h3>
            {profession.name}
          </h3>
        </div>

        <span className="profession-card-arrow">
          →
        </span>
      </div>

      <div className="profession-overview-card-count">
        <strong>
          {profession.characterCount}
        </strong>

        <span>
          zugewiesene Charaktere
        </span>
      </div>

      <div className="profession-overview-card-meta">
        <span>
          {
            profession
              .trackedCharacterCount
          }
          {" mit Spezialisierungsdaten"}
        </span>

        <span>
          {profession.activeNodeCount}
          {" aktive Pfade/Slots"}
        </span>
      </div>
    </Link>
  );
}