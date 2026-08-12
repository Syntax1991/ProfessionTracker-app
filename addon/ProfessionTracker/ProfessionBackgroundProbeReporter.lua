local _, PT = ...

local function formatMatch(
    value
)
    if value == true then
        return "MATCH"
    end

    if value == false then
        return "DIFF"
    end

    return "NO-BASELINE"
end

function PT.PrintBackgroundProbeProfessionResult(
    result
)
    if result.state ~= "PROBED" then
        PT.Print(
            string.format(
                "%s · %s",
                result.professionName,
                result.state
            )
        )

        return
    end

    PT.Print(
        string.format(
            "%s · RecipeInfo %d/%d · learned %d/%s %s · operations %d/%d · simulations %d/%d",
            result.professionName,
            result.recipeResolved
                or 0,
            result.recipeTotal
                or 0,
            result.learnedDetected
                or 0,
            result.learnedStored ~= nil
                and tostring(
                    result.learnedStored
                )
                or "?",
            formatMatch(
                result.learnedSetsMatch
            ),
            result.operationResolved
                or 0,
            result.operationAttempted
                or 0,
            result.simulationResolved
                or 0,
            result.simulationAttempted
                or 0
        )
    )
end

local function collectSummary(
    results
)
    local summary = {
        hasRecipeProbe = false,
        allRecipeReadsComplete = true,
        allLearnedSetsMatch = true,
        operationAttempted = 0,
        operationResolved = 0,
        simulationAttempted = 0,
        simulationResolved = 0
    }

    for _, result in ipairs(
        results
    ) do
        if result.state == "PROBED" then
            summary.hasRecipeProbe = true

            if result.recipeResolved
                ~= result.recipeTotal
            then
                summary.allRecipeReadsComplete =
                    false
            end

            if result.learnedSetsMatch
                ~= true
            then
                summary.allLearnedSetsMatch =
                    false
            end

            summary.operationAttempted =
                summary.operationAttempted
                + (
                    result.operationAttempted
                    or 0
                )

            summary.operationResolved =
                summary.operationResolved
                + (
                    result.operationResolved
                    or 0
                )

            summary.simulationAttempted =
                summary.simulationAttempted
                + (
                    result.simulationAttempted
                    or 0
                )

            summary.simulationResolved =
                summary.simulationResolved
                + (
                    result.simulationResolved
                    or 0
                )
        else
            summary.allRecipeReadsComplete =
                false

            summary.allLearnedSetsMatch =
                false
        end
    end

    return summary
end

function PT.PrintBackgroundProbeSummary(
    results
)
    local summary =
        collectSummary(
            results
        )

    local recipeReady =
        summary.hasRecipeProbe
        and summary.allRecipeReadsComplete
        and summary.allLearnedSetsMatch

    PT.Print(
        string.format(
            "Background-Probe Ergebnis · Recipes=%s · Operations=%d/%d · Simulations=%d/%d",
            recipeReady
                and "READY"
                or "NOT_READY",
            summary.operationResolved,
            summary.operationAttempted,
            summary.simulationResolved,
            summary.simulationAttempted
        )
    )

    if recipeReady then
        PT.Print(
            "Recipe-Background-Sync kann auf Basis des gespeicherten Katalogs umgesetzt werden."
        )

        return
    end

    PT.Print(
        "Recipe-Background-Sync wird noch nicht aktiviert; bestehende Captures bleiben unverändert."
    )
end