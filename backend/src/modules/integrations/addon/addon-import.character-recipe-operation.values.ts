import {
  serializeRecipeOperationMetrics
} from "./addon-import.recipe.operation-metrics.js";
import type {
  AddonCharacterRecipeOperation,
  AddonRecipeOperationMetrics
} from "./addon-import.types.js";

function numberMetric(
  metrics:
    AddonRecipeOperationMetrics,
  key: string
): number | null {
  const value =
    metrics[key];

  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? value
    : null;
}

function integerMetric(
  metrics:
    AddonRecipeOperationMetrics,
  key: string
): number | null {
  const value =
    numberMetric(
      metrics,
      key
    );

  return (
    value !== null &&
    Number.isInteger(value)
  )
    ? value
    : null;
}

function serializeReagentSimulation(
  operation:
    AddonCharacterRecipeOperation
): string | null {
  return operation.reagentSimulation
    ? JSON.stringify(
        operation.reagentSimulation
      )
    : null;
}

export function createCharacterRecipeOperationValues(
  operation:
    AddonCharacterRecipeOperation
) {
  const metrics =
    operation.operationMetrics;

  const baseSkill =
    integerMetric(
      metrics,
      "baseSkill"
    );

  const bonusSkill =
    integerMetric(
      metrics,
      "bonusSkill"
    );

  const effectiveSkill =
    baseSkill !== null &&
    bonusSkill !== null
      ? baseSkill + bonusSkill
      : null;

  const upperSkillThreshold =
    integerMetric(
      metrics,
      "upperSkillTreshold"
    ) ??
    integerMetric(
      metrics,
      "upperSkillThreshold"
    );

  return {
    baseSkill,

    bonusSkill,

    effectiveSkill,

    craftingQuality:
      integerMetric(
        metrics,
        "craftingQuality"
      ),

    craftingQualityId:
      integerMetric(
        metrics,
        "craftingQualityID"
      ),

    guaranteedCraftingQualityId:
      integerMetric(
        metrics,
        "guaranteedCraftingQualityID"
      ),

    lowerSkillThreshold:
      integerMetric(
        metrics,
        "lowerSkillThreshold"
      ),

    upperSkillThreshold,

    concentrationCost:
      integerMetric(
        metrics,
        "concentrationCost"
      ),

    concentrationCurrencyId:
      integerMetric(
        metrics,
        "concentrationCurrencyID"
      ),

    ingenuityRefund:
      integerMetric(
        metrics,
        "ingenuityRefund"
      ),

    quality:
      numberMetric(
        metrics,
        "quality"
      ),

    operationMetricsJson:
      serializeRecipeOperationMetrics(
        metrics
      ),

    reagentSimulationJson:
      serializeReagentSimulation(
        operation
      )
  };
}