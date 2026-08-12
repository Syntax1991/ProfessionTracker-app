import {
  Link
} from "react-router-dom";
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
      return "Equipment Slot";

    case "EQUIPMENT_FAMILY":
      return "Equipment";

    case "PRODUCT_CATEGORY":
      return "Product";

    case "SERVICE":
      return "Service";

    case "RECIPE_GROUP":
      return "Recipe Group";

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
          No crafting capabilities
          have been detected from
          recipe data yet.
        </div>
      </section>
    );
  }

  return (
    <section className="panel profession-coverage-group-panel">
      <header className="profession-coverage-group-panel-header">
        <div>
          <h3>
            Crafting Capabilities
          </h3>

          <p>
            See which characters cover
            each capability with their
            currently captured recipes.
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
                  {
                    group.characters.length === 1
                      ? " crafter"
                      : " crafters"
                  }
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
                            {
                              character
                                .recipeCount === 1
                                ? " recipe"
                                : " recipes"
                            }
                          </span>

                          {character
                            .primaryRecipeCount >
                            0 && (
                            <strong>
                              {
                                character
                                  .primaryRecipeCount
                              }
                              {" primary"}
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