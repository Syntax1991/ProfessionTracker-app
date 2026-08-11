import type {
  ProfessionRecipeCrafterRecommendation,
  ProfessionRecipeReagentSimulation,
  ProfessionRecipeSimulationResult
} from "../types/professionRecipe.types";
import {
  getProfessionRecipeCraftStatusClassName,
  getProfessionRecipeCraftStatusLabel
} from "../utils/professionRecipeStatus";

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

function getRecommendationLabel(
  recommendation:
    ProfessionRecipeCrafterRecommendation
): string {
  switch (recommendation.kind) {
    case "LOW_MATS":
      return "Low Mats reichen";

    case "HIGH_MATS":
      return "High Mats";

    case "HIGH_MATS_CONCENTRATION":
      return recommendation
        .concentrationCost === null
        ? "High Mats + Konzentration"
        : `High Mats + ${recommendation.concentrationCost} Konz.`;

    case "NOT_REACHABLE":
      return "Mit High Mats nicht erreichbar";

    case "UNKNOWN":
      return "Noch keine Empfehlung";
  }
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
      return "Materialdaten unvollständig";

    case "OPERATION_UNAVAILABLE":
      return "Crafting-Operation nicht verfügbar";

    case "UNKNOWN":
      return "Materialsimulation unbekannt";
  }
}

function Recommendation({
  recommendation
}: {
  recommendation:
    ProfessionRecipeCrafterRecommendation;
}) {
  if (
    recommendation.kind ===
    "UNKNOWN"
  ) {
    return null;
  }

  return (
    <div className="profession-recipe-recommendation">
      <span>
        Empfehlung
      </span>

      <strong>
        {
          getRecommendationLabel(
            recommendation
          )
        }
      </strong>

      {recommendation.craftingQuality !==
        null && (
        <small>
          Q
          {
            recommendation
              .craftingQuality
          }
          {recommendation.effectiveSkill !==
            null && (
            <>
              {" · Skill "}
              {
                recommendation
                  .effectiveSkill
              }
            </>
          )}
        </small>
      )}
    </div>
  );
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
            Materialsimulation
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
          {" Slots erfasst"}
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
      label: "High + Konz.",
      result:
        simulation
          .highestQualityWithConcentration
    }
  ];

  return (
    <div className="profession-recipe-simulation">
      <div className="profession-recipe-simulation-header">
        <strong>
          Materialsimulation
        </strong>

        <span>
          {
            simulation.qualitySlotCount
          }
          {" Quality-Slots"}
        </span>
      </div>

      <Recommendation
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
                    Qualität
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
                    Konz.
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