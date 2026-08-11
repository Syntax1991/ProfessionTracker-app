import {
  calculateProfessionRecipeCraftStatus
} from "./profession-recipe-craft-status.js";
import type {
  ProfessionRecipeOperation,
  ProfessionRecipeReagentSimulation,
  ProfessionRecipeReagentSimulationStatus,
  ProfessionRecipeSimulationResult
} from "./profession-recipe.types.js";

type JsonRecord =
  Record<string, unknown>;

function asRecord(
  value: unknown
): JsonRecord | null {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
    ? value as JsonRecord
    : null;
}

function numberValue(
  record: JsonRecord,
  key: string
): number | null {
  const value =
    record[key];

  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? value
    : null;
}

function integerValue(
  record: JsonRecord,
  key: string
): number | null {
  const value =
    numberValue(
      record,
      key
    );

  return (
    value !== null &&
    Number.isInteger(value)
  )
    ? value
    : null;
}

function nonNegativeInteger(
  record: JsonRecord,
  key: string
): number {
  const value =
    integerValue(
      record,
      key
    );

  return (
    value !== null &&
    value >= 0
  )
    ? value
    : 0;
}

function simulationStatus(
  value: unknown
): ProfessionRecipeReagentSimulationStatus {
  switch (value) {
    case "CAPTURED":
    case "NO_REQUIRED_MODIFIED_REAGENTS":
    case "INCOMPLETE_REAGENTS":
    case "OPERATION_UNAVAILABLE":
      return value;

    default:
      return "UNKNOWN";
  }
}

function mapSimulationOperation(
  value: unknown
): ProfessionRecipeOperation {
  const metrics =
    asRecord(
      value
    );

  const captured =
    metrics !== null &&
    Object.keys(
      metrics
    ).length > 0;

  if (!metrics) {
    return createMissingOperation();
  }

  const baseSkill =
    integerValue(
      metrics,
      "baseSkill"
    );

  const bonusSkill =
    integerValue(
      metrics,
      "bonusSkill"
    );

  return {
    status:
      captured
        ? "CAPTURED"
        : "MISSING",

    baseSkill,

    bonusSkill,

    effectiveSkill:
      baseSkill !== null &&
      bonusSkill !== null
        ? baseSkill +
          bonusSkill
        : null,

    craftingQuality:
      integerValue(
        metrics,
        "craftingQuality"
      ),

    craftingQualityId:
      integerValue(
        metrics,
        "craftingQualityID"
      ),

    guaranteedCraftingQualityId:
      integerValue(
        metrics,
        "guaranteedCraftingQualityID"
      ),

    lowerSkillThreshold:
      integerValue(
        metrics,
        "lowerSkillThreshold"
      ),

    upperSkillThreshold:
      integerValue(
        metrics,
        "upperSkillTreshold"
      ) ??
      integerValue(
        metrics,
        "upperSkillThreshold"
      ),

    concentrationCost:
      integerValue(
        metrics,
        "concentrationCost"
      ),

    concentrationCurrencyId:
      integerValue(
        metrics,
        "concentrationCurrencyID"
      ),

    ingenuityRefund:
      integerValue(
        metrics,
        "ingenuityRefund"
      ),

    quality:
      numberValue(
        metrics,
        "quality"
      ),

    capturedAt: null,
    captureVersion: null,
    scopeVersion: null
  };
}

function createMissingOperation():
  ProfessionRecipeOperation {
  return {
    status: "MISSING",
    baseSkill: null,
    bonusSkill: null,
    effectiveSkill: null,
    craftingQuality: null,
    craftingQualityId: null,
    guaranteedCraftingQualityId: null,
    lowerSkillThreshold: null,
    upperSkillThreshold: null,
    concentrationCost: null,
    concentrationCurrencyId: null,
    ingenuityRefund: null,
    quality: null,
    capturedAt: null,
    captureVersion: null,
    scopeVersion: null
  };
}

function mapSimulationResult(
  baseDifficulty: number | null,
  value: unknown
): ProfessionRecipeSimulationResult {
  const operation =
    mapSimulationOperation(
      value
    );

  return {
    craftStatus:
      calculateProfessionRecipeCraftStatus(
        baseDifficulty,
        operation
      ),

    operation
  };
}

export function mapProfessionRecipeReagentSimulation(
  baseDifficulty: number | null,
  json: string | null
): ProfessionRecipeReagentSimulation | null {
  if (!json) {
    return null;
  }

  let rawValue: unknown;

  try {
    rawValue =
      JSON.parse(
        json
      );
  } catch {
    return null;
  }

  const raw =
    asRecord(
      rawValue
    );

  if (!raw) {
    return null;
  }

  const captureVersion =
    integerValue(
      raw,
      "captureVersion"
    );

  if (
    captureVersion === null ||
    captureVersion < 1
  ) {
    return null;
  }

  return {
    status:
      simulationStatus(
        raw.status
      ),

    captureVersion,

    requiredModifiedSlotCount:
      nonNegativeInteger(
        raw,
        "requiredModifiedSlotCount"
      ),

    simulatedSlotCount:
      nonNegativeInteger(
        raw,
        "simulatedSlotCount"
      ),

    qualitySlotCount:
      nonNegativeInteger(
        raw,
        "qualitySlotCount"
      ),

    concentrationCaptured:
      raw.concentrationCaptured ===
      true,

    lowestQuality:
      mapSimulationResult(
        baseDifficulty,
        raw.lowestQualityOperation
      ),

    highestQuality:
      mapSimulationResult(
        baseDifficulty,
        raw.highestQualityOperation
      ),

    highestQualityWithConcentration:
      mapSimulationResult(
        baseDifficulty,
        raw.highestQualityConcentrationOperation
      )
  };
}