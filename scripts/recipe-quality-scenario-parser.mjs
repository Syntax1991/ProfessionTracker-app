import {
  isLuaTable,
  luaValues,
  numberOrNull,
  scalarObject,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

function effectiveSkill(metrics) {
  const baseSkill =
    numberOrNull(
      metrics.baseSkill
    );

  const bonusSkill =
    numberOrNull(
      metrics.bonusSkill
    );

  if (
    baseSkill === null ||
    bonusSkill === null
  ) {
    return null;
  }

  return baseSkill + bonusSkill;
}

function readSelection(value) {
  if (!isLuaTable(value)) {
    return null;
  }

  return {
    slotIndex:
      numberOrNull(
        value.slotIndex
      ),

    dataSlotIndex:
      numberOrNull(
        value.dataSlotIndex
      ),

    candidateIndex:
      numberOrNull(
        value.candidateIndex
      ),

    itemId:
      numberOrNull(
        value.itemID
      ),

    currencyId:
      numberOrNull(
        value.currencyID
      ),

    quality:
      numberOrNull(
        value.quality
      ),

    quantity:
      numberOrNull(
        value.quantity
      )
  };
}

function readScenario(value) {
  if (!isLuaTable(value)) {
    return null;
  }

  const metrics =
    scalarObject(
      value.operationMetrics
    );

  const selections =
    luaValues(
      value.selections
    )
      .map(
        readSelection
      )
      .filter(
        (selection) =>
          selection !== null
      );

  const qualities =
    selections
      .map(
        (selection) =>
          selection.quality
      )
      .filter(
        (quality) =>
          quality !== null
      );

  return {
    scenarioIndex:
      numberOrNull(
        value.scenarioIndex
      ),

    qualityScore:
      numberOrNull(
        value.qualityScore
      ),

    qualitySignature:
      stringOrNull(
        value.qualitySignature
      ),

    selections,
    qualities,

    mixedQualities:
      new Set(
        qualities
      ).size > 1,

    operation: {
      effectiveSkill:
        effectiveSkill(
          metrics
        ),

      baseSkill:
        numberOrNull(
          metrics.baseSkill
        ),

      bonusSkill:
        numberOrNull(
          metrics.bonusSkill
        ),

      craftingQuality:
        numberOrNull(
          metrics.craftingQuality
        ),

      lowerSkillThreshold:
        numberOrNull(
          metrics.lowerSkillThreshold
        ),

      upperSkillThreshold:
        numberOrNull(
          metrics.upperSkillTreshold
        ) ??
        numberOrNull(
          metrics.upperSkillThreshold
        ),

      concentrationCost:
        numberOrNull(
          metrics.concentrationCost
        )
    }
  };
}

export function readRecipeQualitySimulation(
  value
) {
  if (!isLuaTable(value)) {
    return null;
  }

  const scenarios =
    luaValues(
      value.qualityScenarios
    )
      .map(
        readScenario
      )
      .filter(
        (scenario) =>
          scenario !== null
      );

  return {
    captureVersion:
      numberOrNull(
        value.captureVersion
      ),

    status:
      stringOrNull(
        value.status
      ),

    requiredModifiedSlotCount:
      numberOrNull(
        value.requiredModifiedSlotCount
      ) ?? 0,

    qualitySlotCount:
      numberOrNull(
        value.qualitySlotCount
      ) ?? 0,

    qualityScenarioStatus:
      stringOrNull(
        value.qualityScenarioStatus
      ),

    qualityScenarioLimit:
      numberOrNull(
        value.qualityScenarioLimit
      ) ?? 0,

    combinationCount:
      numberOrNull(
        value.qualityScenarioCombinationCount
      ) ?? 0,

    capturedCount:
      numberOrNull(
        value.qualityScenarioCapturedCount
      ) ?? 0,

    scenarios
  };
}