import { Link } from "react-router-dom";
import type {
  ProfessionCapabilityGroup
} from "../utils/professionCapabilityGroups";

type ProfessionCapabilityGroupListProps = {
  groups:
    ProfessionCapabilityGroup[];
};

function getCapabilityTypeLabel(
  type: string
): string {
  switch (type) {
    case "EQUIPMENT_SLOT":
      return "Equipment-Slot";

    case "EQUIPMENT_FAMILY":
      return "Equipment";

    case "PRODUCT_CATEGORY":
      return "Produkt";

    case "SERVICE":
      return "Service";

    case "RECIPE_GROUP":
      return "Rezeptgruppe";

    default:
      return type;
  }
}

export function ProfessionCapabilityGroupList({
  groups
}: ProfessionCapabilityGroupListProps) {
  if (groups.length === 0) {
    return (
      <section className="panel profession-coverage-group-panel">
        <div className="profession-coverage-group-empty">
          Noch keine Craft-Fähigkeiten aus
          Rezeptdaten erkannt.
        </div>
      </section>
    );
  }

  return (
    <section className="panel profession-coverage-group-panel">
      <header className="profession-coverage-group-panel-header">
        <div>
          <h3>
            Craft-Fähigkeiten
          </h3>

          <p>
            Pro Fähigkeit siehst du direkt,
            welche Charaktere sie mit ihren
            aktuell erfassten Rezepten
            abdecken.
          </p>
        </div>

        <span>
          {groups.length}
        </span>
      </header>

      <div className="profession-coverage-group-list">
        {groups.map(
          (group) => (
            <article
              className="profession-coverage-group profession-capability-group"
              key={group.id}
            >
              <header>
                <div>
                  <h4>
                    {group.name}
                  </h4>

                  <small>
                    {
                      getCapabilityTypeLabel(
                        group.type
                      )
                    }
                    {" · "}
                    {group.expansion}
                  </small>
                </div>

                <span>
                  {group.characters.length}
                  {" Crafter"}
                </span>
              </header>

              {group.description && (
                <p className="profession-capability-group-description">
                  {group.description}
                </p>
              )}

              <ul>
                {group.characters.map(
                  (character) => (
                    <li
                      key={
                        character.id
                      }
                    >
                      <Link
                        to={
                          `/characters/${character.id}`
                        }
                      >
                        <div>
                          <strong>
                            {character.name}
                          </strong>

                          <span>
                            {
                              character.className
                            }
                            {" · "}
                            {character.realm}
                          </span>
                        </div>

                        <div className="profession-coverage-character-meta">
                          <span>
                            {
                              character
                                .recipeCount
                            }
                            {" Rezepte"}
                          </span>

                          {character
                            .primaryRecipeCount >
                            0 && (
                            <strong>
                              {
                                character
                                  .primaryRecipeCount
                              }
                              {" primär"}
                            </strong>
                          )}
                        </div>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </article>
          )
        )}
      </div>
    </section>
  );
}