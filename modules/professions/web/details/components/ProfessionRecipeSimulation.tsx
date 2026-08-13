import type {
  ProfessionRecipeCrafterRecommendation,
  ProfessionRecipeReagentSimulation,
  ProfessionRecipeSimulationResult
} from "../types/professionRecipe.types";
import {
  getProfessionRecipeCraftStatusClassName,
  getProfessionRecipeCraftStatusLabel
} from "../utils/professionRecipeStatus";
import {
  ProfessionRecipeRecommendation
} from "./ProfessionRecipeRecommendation";

type ProfessionRecipeSimulationProps = {
  simulation:
    ProfessionRecipeReagentSimulation | null;
  recommendation:
    ProfessionRecipeCrafterRecommendation;
};

type Scenario = {
  key: string;
  label: string;
  result:
    ProfessionRecipeSimulationResult;
};

function getSkill(
  result:
    ProfessionRecipeSimulationResult
): number | null {
  return result.operation
    .effectiveSkill;
}

function getQuality(
  result:
    ProfessionRecipeSimulationResult
): string {
  const quality =
    result.operation
      .craftingQuality;

  return quality === null
    ? "–"
    : `Q${quality}`;
}

function getConcentration(
  result:
    ProfessionRecipeSimulationResult
): string {
  const cost =
    result.operation
      .concentrationCost;

  return cost === null
    ? "–"
    : `${cost}`;
}

function getUnavailableLabel(
  simulation:
    ProfessionRecipeReagentSimulation
): string | null {
  switch (simulation.status) {
    case "CAPTURED":
      return null;

    case "NO_REQUIRED_MODIFIED_REAGENTS":
      return null;

    case "INCOMPLETE_REAGENTS":
      return "Material data incomplete";

    case "OPERATION_UNAVAILABLE":
      return "Crafting operation unavailable";

    case "UNKNOWN":
      return "Material simulation unknown";
  }
}

export function ProfessionRecipeSimulation({
  simulation,
  recommendation
}: ProfessionRecipeSimulationProps) {
  if (
    !simulation ||
    simulation.status ===
      "NO_REQUIRED_MODIFIED_REAGENTS"
  ) {
    return null;
  }

  const unavailableLabel =
    getUnavailableLabel(
      simulation
    );

  if (unavailableLabel) {
    return (
      <div className="profession-recipe-simulation unavailable">
        <div className="profession-recipe-simulation-header">
          <strong>
            Material Simulation
          </strong>

          <span>
            {unavailableLabel}
          </span>
        </div>

        <div className="profession-recipe-simulation-meta">
          {
            simulation.simulatedSlotCount
          }
          {"/"}
          {
            simulation.requiredModifiedSlotCount
          }
          {" slots captured"}
        </div>
      </div>
    );
  }

  const scenarios: Scenario[] = [
    {
      key: "low",
      label: "Low Mats",
      result:
        simulation.lowestQuality
    },
    {
      key: "high",
      label: "High Mats",
      result:
        simulation.highestQuality
    },
    {
      key: "high-concentration",
      label: "High + Conc.",
      result:
        simulation
          .highestQualityWithConcentration
    }
  ];

  return (
    <div className="profession-recipe-simulation">
      <div className="profession-recipe-simulation-header">
        <strong>
          Material Simulation
        </strong>

        <span>
          {
            simulation.qualitySlotCount
          }
          {" quality slots"}
        </span>
      </div>

      <ProfessionRecipeRecommendation
        recommendation={
          recommendation
        }
      />

      <div className="profession-recipe-simulation-grid">
        {scenarios.map(
          (scenario) => (
            <div
              className="profession-recipe-simulation-card"
              key={scenario.key}
            >
              <div className="profession-recipe-simulation-card-header">
                <strong>
                  {scenario.label}
                </strong>

                <span
                  className={
                    getProfessionRecipeCraftStatusClassName(
                      scenario.result
                        .craftStatus
                    )
                  }
                >
                  {
                    getProfessionRecipeCraftStatusLabel(
                      scenario.result
                        .craftStatus
                    )
                  }
                </span>
              </div>

              <dl>
                <div>
                  <dt>
                    Skill
                  </dt>

                  <dd>
                    {
                      getSkill(
                        scenario.result
                      ) ??
                      "–"
                    }
                  </dd>
                </div>

                <div>
                  <dt>
                    Quality
                  </dt>

                  <dd>
                    {
                      getQuality(
                        scenario.result
                      )
                    }
                  </dd>
                </div>

                <div>
                  <dt>
                    Conc.
                  </dt>

                  <dd>
                    {
                      getConcentration(
                        scenario.result
                      )
                    }
                  </dd>
                </div>
              </dl>
            </div>
          )
        )}
      </div>
    </div>
  );
}