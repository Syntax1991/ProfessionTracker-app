function coveragePercent(
  total,
  captured
) {
  if (total <= 0) {
    return 0;
  }

  return Math.round(
    (captured / total) *
      1000
  ) / 10;
}

function analyzeCrafter(
  crafter,
  totals
) {
  const operation =
    crafter.operation;

  if (
    operation.status !==
    "CAPTURED"
  ) {
    totals.missing += 1;
    return;
  }

  totals.captured += 1;

  if (
    (operation.captureVersion ?? 0) < 3 ||
    (operation.scopeVersion ?? 0) < 1
  ) {
    totals.invalidVersions += 1;
  }

  if (
    operation.baseSkill === null ||
    operation.bonusSkill === null ||
    operation.effectiveSkill === null
  ) {
    totals.missingSkillValues += 1;
    return;
  }

  totals.effectiveSkillChecks += 1;

  if (
    operation.effectiveSkill !==
    operation.baseSkill +
      operation.bonusSkill
  ) {
    totals.effectiveSkillMismatches += 1;
  }
}

function analyzeItem(
  item,
  totals
) {
  const beforeCaptured =
    totals.captured;

  const beforeMissing =
    totals.missing;

  for (
    const crafter of
    item.crafters
  ) {
    totals.crafterRows += 1;

    analyzeCrafter(
      crafter,
      totals
    );
  }

  const captured =
    totals.captured -
    beforeCaptured;

  const missing =
    totals.missing -
    beforeMissing;

  const coverage =
    item.operationCoverage;

  if (
    coverage.totalCrafterCount !==
      item.crafters.length ||
    coverage.capturedCrafterCount !==
      captured ||
    coverage.missingCrafterCount !==
      missing ||
    coverage.coveragePercent !==
      coveragePercent(
        item.crafters.length,
        captured
      )
  ) {
    totals.itemCoverageMismatches += 1;
  }
}

function analyzeProfession(
  catalog,
  profession
) {
  const totals = {
    crafterRows: 0,
    captured: 0,
    missing: 0,
    invalidVersions: 0,
    missingSkillValues: 0,
    effectiveSkillChecks: 0,
    effectiveSkillMismatches: 0,
    itemCoverageMismatches: 0
  };

  for (
    const item of
    catalog.items
  ) {
    analyzeItem(
      item,
      totals
    );
  }

  const summary =
    catalog.summary;

  const summaryMismatch =
    summary.crafterRecipeCount !==
      totals.crafterRows ||
    summary
      .operationCapturedCrafterRecipeCount !==
      totals.captured ||
    summary
      .operationMissingCrafterRecipeCount !==
      totals.missing ||
    summary.operationCoveragePercent !==
      coveragePercent(
        totals.crafterRows,
        totals.captured
      );

  return {
    id: profession.id,
    name: profession.name,
    catalogRecipes:
      catalog.items.length,
    craftableRecipes:
      summary.craftableRecipeCount,
    crafterRecipeRows:
      totals.crafterRows,
    capturedOperationRows:
      totals.captured,
    missingOperationRows:
      totals.missing,
    operationCoveragePercent:
      summary.operationCoveragePercent,
    invalidCaptureVersions:
      totals.invalidVersions,
    missingCapturedSkillValues:
      totals.missingSkillValues,
    effectiveSkillChecks:
      totals.effectiveSkillChecks,
    effectiveSkillMismatches:
      totals.effectiveSkillMismatches,
    itemCoverageMismatches:
      totals.itemCoverageMismatches,
    summaryMismatch
  };
}

export async function createProfessionRecipeOperationApiReport(
  service,
  professions
) {
  const professionReports =
    [];

  let rawOperationJsonExposed =
    false;

  for (
    const profession of
    professions
  ) {
    const catalog =
      await service.getRecipes(
        profession.id
      );

    if (
      JSON.stringify(
        catalog
      ).includes(
        "operationMetricsJson"
      )
    ) {
      rawOperationJsonExposed =
        true;
    }

    if (
      catalog.items.length ===
      0
    ) {
      continue;
    }

    professionReports.push(
      analyzeProfession(
        catalog,
        profession
      )
    );
  }

  const sum =
    (key) =>
      professionReports.reduce(
        (total, report) =>
          total +
          report[key],
        0
      );

  const crafterRecipeRows =
    sum(
      "crafterRecipeRows"
    );

  const capturedOperationRows =
    sum(
      "capturedOperationRows"
    );

  return {
    professionsWithRecipes:
      professionReports.length,
    catalogRecipes:
      sum("catalogRecipes"),
    crafterRecipeRows,
    capturedOperationRows,
    missingOperationRows:
      sum("missingOperationRows"),
    operationCoveragePercent:
      coveragePercent(
        crafterRecipeRows,
        capturedOperationRows
      ),
    effectiveSkillChecks:
      sum("effectiveSkillChecks"),
    effectiveSkillMismatches:
      sum("effectiveSkillMismatches"),
    invalidCaptureVersions:
      sum("invalidCaptureVersions"),
    missingCapturedSkillValues:
      sum("missingCapturedSkillValues"),
    itemCoverageMismatches:
      sum("itemCoverageMismatches"),
    summaryMismatches:
      professionReports.filter(
        (report) =>
          report.summaryMismatch
      ).length,
    rawOperationJsonExposed,
    professions:
      professionReports
  };
}

export function assertProfessionRecipeOperationApiReport(
  report
) {
  if (
    report.capturedOperationRows ===
    0
  ) {
    throw new Error(
      "No captured character recipe operations reached the profession recipe API."
    );
  }

  const validationErrors =
    report.effectiveSkillMismatches +
    report.invalidCaptureVersions +
    report.missingCapturedSkillValues +
    report.itemCoverageMismatches +
    report.summaryMismatches;

  if (
    validationErrors > 0 ||
    report.rawOperationJsonExposed
  ) {
    throw new Error(
      "Profession recipe operation API validation failed."
    );
  }
}