import {
  Link
} from "react-router-dom";
import {
  countCrafterStatus
} from "./professionCrafterView.helpers";
import type {
  ProfessionCrafterSummary
} from "./professionCrafterView.helpers";

export function ProfessionCrafterSummaryHeader({
  summary
}: {
  summary:
    ProfessionCrafterSummary;
}) {
  const {
    coverage,
    entries
  } = summary;

  return (
    <section className="panel profession-crafter-header">
      <div className="profession-crafter-identity">
        <div className="character-avatar">
          {
            coverage.character
              .name
              .slice(
                0,
                2
              )
              .toUpperCase()
          }
        </div>

        <div>
          <h3>
            {
              coverage.character
                .name
            }
          </h3>

          <p>
            {
              coverage.character
                .className
            }
            {" · "}
            {
              coverage.character
                .realm
            }
            {" · Skill "}
            {coverage.skill}
          </p>
        </div>
      </div>

      <div className="profession-crafter-header-stats">
        <div>
          <span>
            Recipes
          </span>

          <strong>
            {entries.length}
          </strong>
        </div>

        <div>
          <span>
            Safe
          </span>

          <strong>
            {
              countCrafterStatus(
                entries,
                "SAFE"
              )
            }
          </strong>
        </div>

        <div>
          <span>
            Concentration
          </span>

          <strong>
            {
              countCrafterStatus(
                entries,
                "CONCENTRATION"
              )
            }
          </strong>
        </div>

        <div>
          <span>
            Not Safe
          </span>

          <strong>
            {
              countCrafterStatus(
                entries,
                "NOT_SAFE"
              )
            }
          </strong>
        </div>
      </div>

      <Link
        className="text-button"
        to={
          `/characters/${coverage.character.id}`
        }
      >
        Character Details
      </Link>
    </section>
  );
}