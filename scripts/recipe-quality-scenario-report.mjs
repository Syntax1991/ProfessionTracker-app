import {
  numberOrNull,
  stringOrNull
} from "./character-recipe-operation-table.mjs";

import {
  readRecipeQualityScenarioData
} from "./recipe-quality-scenario-reader.mjs";

function buildStatusCounts(recipes) {
  const counts = {};

  for (const recipe of recipes) {
    const status =
      recipe.simulation
        .qualityScenarioStatus ??
      "UNKNOWN";

    counts[status] =
      (counts[status] ?? 0) + 1;
  }

  return counts;
}

function isIntermediateSkill(
  skill,
  minimum,
  maximum
) {
  return (
    skill !== null &&
    minimum !== null &&
    maximum !== null &&
    skill > minimum &&
    skill < maximum
  );
}

function analyzeRecipe(recipe) {
  const scenarios =
    recipe.simulation.scenarios;

  const skills =
    scenarios
      .map(
        (scenario) =>
          scenario.operation
            .effectiveSkill
      )
      .filter(
        (skill) =>
          skill !== null
      );

  const minimumSkill =
    skills.length > 0
      ? Math.min(...skills)
      : null;

  const maximumSkill =
    skills.length > 0
      ? Math.max(...skills)
      : null;

  const mixedScenarios =
    scenarios.filter(
      (scenario) =>
        scenario.mixedQualities
    );

  const intermediateScenarios =
    scenarios.filter(
      (scenario) =>
        isIntermediateSkill(
          scenario.operation
            .effectiveSkill,
          minimumSkill,
          maximumSkill
        )
    );

  return {
    characterKey:
      recipe.characterKey,

    professionName:
      recipe.professionName,

    expansionName:
      recipe.expansionName,

    recipeId:
      recipe.recipeId,

    recipeName:
      recipe.recipeName,

    categoryName:
      recipe.categoryName,

    status:
      recipe.simulation.status,

    scenarioStatus:
      recipe.simulation
        .qualityScenarioStatus,

    qualitySlots:
      recipe.simulation
        .qualitySlotCount,

    combinationCount:
      recipe.simulation
        .combinationCount,

    capturedCount:
      recipe.simulation
        .capturedCount,

    scenarioCount:
      scenarios.length,

    minimumSkill,
    maximumSkill,

    mixedScenarioCount:
      mixedScenarios.length,

    intermediateSkillScenarioCount:
      intermediateScenarios.length,

    hasMixedScenario:
      mixedScenarios.length > 0,

    hasIntermediateSkill:
      intermediateScenarios.length > 0,

    scenarios:
      scenarios.map(
        (scenario) => ({
          scenarioIndex:
            scenario.scenarioIndex,

          qualityScore:
            scenario.qualityScore,

          qualitySignature:
            scenario.qualitySignature,

          qualities:
            scenario.qualities,

          mixedQualities:
            scenario.mixedQualities,

          effectiveSkill:
            scenario.operation
              .effectiveSkill,

          baseSkill:
            scenario.operation
              .baseSkill,

          bonusSkill:
            scenario.operation
              .bonusSkill,

          craftingQuality:
            scenario.operation
              .craftingQuality,

          concentrationCost:
            scenario.operation
              .concentrationCost
        })
      )
  };
}

export function buildRecipeQualityScenarioReport(
  root
) {
  const recipes =
    readRecipeQualityScenarioData(
      root
    );

  const analyzed =
    recipes.map(
      analyzeRecipe
    );

  const recipesWithScenarios =
    analyzed.filter(
      (recipe) =>
        recipe.scenarioCount > 0
    );

  const recipesWithMixed =
    analyzed.filter(
      (recipe) =>
        recipe.hasMixedScenario
    );

  const recipesWithIntermediateSkill =
    analyzed.filter(
      (recipe) =>
        recipe.hasIntermediateSkill
    );

  const totalScenarios =
    analyzed.reduce(
      (sum, recipe) =>
        sum +
        recipe.scenarioCount,
      0
    );

  const totalMixedScenarios =
    analyzed.reduce(
      (sum, recipe) =>
        sum +
        recipe.mixedScenarioCount,
      0
    );

  const totalIntermediateSkills =
    analyzed.reduce(
      (sum, recipe) =>
        sum +
        recipe
          .intermediateSkillScenarioCount,
      0
    );

  const schemaVersion =
    numberOrNull(
      root.schemaVersion
    );

  return {
    addonVersion:
      stringOrNull(
        root.addonVersion
      ),

    schemaVersion,

    totals: {
      recipeSimulations:
        analyzed.length,

      recipesWithScenarios:
        recipesWithScenarios.length,

      recipesWithMixedScenarios:
        recipesWithMixed.length,

      recipesWithIntermediateSkill:
        recipesWithIntermediateSkill
          .length,

      qualityScenarios:
        totalScenarios,

      mixedQualityScenarios:
        totalMixedScenarios,

      intermediateSkillScenarios:
        totalIntermediateSkills
    },

    scenarioStatuses:
      buildStatusCounts(
        recipes
      ),

    validation: {
      addon070OrNewer:
        typeof root.addonVersion ===
          "string" &&
        (
          schemaVersion ??
          0
        ) >= 8,

      schema8OrNewer:
        (
          schemaVersion ??
          0
        ) >= 8,

      hasCapturedScenarios:
        totalScenarios > 0,

      hasMixedQualityScenarios:
        totalMixedScenarios > 0,

      hasIntermediateSkillResult:
        totalIntermediateSkills > 0
    },

    recipes:
      analyzed
        .filter(
          (recipe) =>
            recipe.scenarioCount > 0 ||
            recipe.combinationCount > 0
        )
        .slice(
          0,
          40
        )
  };
}