import type {
  ProfessionCapabilityCoverage
} from "../types/professionDetail.types";

type ProfessionCapabilityListProps = {
  capabilities:
    ProfessionCapabilityCoverage[];
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

export function ProfessionCapabilityList({
  capabilities
}: ProfessionCapabilityListProps) {
  return (
    <section className="profession-detail-coverage-section">
      <header>
        <h4>
          Craft-Fähigkeiten
        </h4>

        <span>
          {capabilities.length}
        </span>
      </header>

      {capabilities.length === 0 ? (
        <div className="profession-detail-empty-list">
          Noch keine Craft-Fähigkeiten aus
          den Rezepten dieses Charakters
          erkannt.
        </div>
      ) : (
        <ul>
          {capabilities.map(
            (capability) => (
              <li
                className="profession-capability-entry"
                key={capability.id}
              >
                <div className="profession-capability-name">
                  <strong>
                    {capability.name}
                  </strong>

                  <small>
                    {
                      getCapabilityTypeLabel(
                        capability.type
                      )
                    }
                    {" · "}
                    {capability.expansion}
                  </small>

                  {capability.description && (
                    <small>
                      {
                        capability
                          .description
                      }
                    </small>
                  )}
                </div>

                <div className="profession-capability-entry-meta">
                  <span>
                    {
                      capability
                        .recipeCount
                    }
                    {" Rezepte"}
                  </span>

                  {capability
                    .primaryRecipeCount >
                    0 && (
                    <strong>
                      {
                        capability
                          .primaryRecipeCount
                      }
                      {" primär"}
                    </strong>
                  )}
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}