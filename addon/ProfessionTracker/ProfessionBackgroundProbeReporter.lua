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
            "%s · RecipeInfo %d/%d directLearned=%d · Ability %d/%d learned=%d/%s %s · source=%s · operations %d/%d · simulations %d/%d",
            result.professionName,
            result.recipeResolved
                or 0,
            result.recipeTotal
                or 0,
            result.directLearned
                or 0,
            result.abilityResolved
                or 0,
            result.abilityEligible
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
            result.learnedSource
                or "NONE",
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
        hasProbe = false,
        abilityComplete = true,
        learnedReady = true,
        operationAttempted = 0,
        operationResolved = 0,
        simulationAttempted = 0,
        simulationResolved = 0
    }

    for _, result in ipairs(
        results
    ) do
        if result.state ~= "PROBED" then
            summary.abilityComplete =
                false

            summary.learnedReady =
                false
        else
            summary.hasProbe = true

            if result.learnedSource ~= "ABILITY"
                or result.abilityEligible <= 0
                or result.abilityResolved
                    ~= result.abilityEligible
            then
                summary.abilityComplete =
                    false
            end

            if result.learnedSetsMatch
                ~= true
                or (
                    result.learnedDetected
                    or 0
                ) <= 0
            then
                summary.learnedReady =
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
        end
    end

    return summary
end

local function readyLabel(
    value
)
    return value
        and "READY"
        or "NOT_READY"
end

function PT.PrintBackgroundProbeSummary(
    results
)
    local summary =
        collectSummary(
            results
        )

    local recipesReady =
        summary.hasProbe
        and summary.abilityComplete
        and summary.learnedReady

    local operationsReady =
        summary.operationAttempted > 0
        and summary.operationResolved
            == summary.operationAttempted

    local simulationsReady =
        summary.simulationAttempted > 0
        and summary.simulationResolved
            == summary.simulationAttempted

    local contextFreeReady =
        recipesReady
        and operationsReady
        and simulationsReady

    PT.Print(
        string.format(
            "Context-Free-Probe Ergebnis · Recipes=%s · Operations=%s %d/%d · Simulations=%s %d/%d",
            readyLabel(
                recipesReady
            ),
            readyLabel(
                operationsReady
            ),
            summary.operationResolved,
            summary.operationAttempted,
            readyLabel(
                simulationsReady
            ),
            summary.simulationResolved,
            summary.simulationAttempted
        )
    )

    if contextFreeReady then
        PT.Print(
            "Context-Free-Capture ist technisch bereit: kein OpenTradeSkill und kein Profession-Fenster erforderlich."
        )

        return true
    end

    PT.Print(
        "Context-Free-Capture wird noch nicht aktiviert."
    )

    return false
end