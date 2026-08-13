local _, PT = ...

local function yesNo(
    value
)
    return value
        and "YES"
        or "NO"
end

local function readyLabel(
    value
)
    return value
        and "READY"
        or "NOT_READY"
end

local function hiddenLabel(
    visible
)
    return visible
        and "VISIBLE"
        or "HIDDEN"
end

local function baselineLabel(
    result
)
    if result.learnedBaseline == nil then
        return "?"
    end

    return tostring(
        result.learnedBaseline
    )
end

local function matchLabel(
    result
)
    if result.baselineMatches == true then
        return "MATCH"
    end

    if result.baselineMatches == false then
        return "DIFF"
    end

    return "NO-BASELINE"
end

function PT.PrintHeadlessProbeProfessionResult(
    result
)
    PT.Print(
        string.format(
            "%s · open=%s/%s · context=%s · UI=%s · RecipeInfo %d/%d · learned %d/%s %s · operations %d/%d · simulations %d/%d",
            result.professionName,
            yesNo(
                result.openCallSuccess
            ),
            yesNo(
                result.openReturned
            ),
            readyLabel(
                result.contextReady
            ),
            hiddenLabel(
                result.uiVisible
            ),
            result.recipeResolved
                or 0,
            result.recipeTotal
                or 0,
            result.learnedDetected
                or 0,
            baselineLabel(
                result
            ),
            matchLabel(
                result
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

local function createSummary(
    results
)
    local summary = {
        allContextsReady = true,
        allUIHidden = true,
        allRecipeReadsComplete = true,
        allLearnedAvailable = true,
        baselineCompared = 0,
        baselineMismatch = 0,
        operationAttempted = 0,
        operationResolved = 0,
        simulationAttempted = 0,
        simulationResolved = 0
    }

    for _, result in ipairs(
        results
    ) do
        if not result.contextReady then
            summary.allContextsReady =
                false
        end

        if result.uiVisible then
            summary.allUIHidden =
                false
        end

        if result.recipeResolved
            ~= result.recipeTotal
        then
            summary.allRecipeReadsComplete =
                false
        end

        if (
            result.learnedDetected
            or 0
        ) <= 0
        then
            summary.allLearnedAvailable =
                false
        end

        if result.baselineMatches ~= nil then
            summary.baselineCompared =
                summary.baselineCompared + 1

            if result.baselineMatches == false then
                summary.baselineMismatch =
                    summary.baselineMismatch + 1
            end
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

    return summary
end

local function baselineSummary(
    summary
)
    if summary.baselineCompared == 0 then
        return "NONE"
    end

    if summary.baselineMismatch > 0 then
        return "DIFF"
    end

    return "MATCH"
end

function PT.PrintHeadlessProbeSummary(
    results
)
    local summary =
        createSummary(
            results
        )

    local recipesReady =
        #results > 0
        and summary.allContextsReady
        and summary.allRecipeReadsComplete
        and summary.allLearnedAvailable
        and summary.baselineMismatch == 0

    local operationsReady =
        summary.operationAttempted > 0
        and summary.operationResolved
            == summary.operationAttempted

    local simulationsReady =
        summary.simulationAttempted > 0
        and summary.simulationResolved
            == summary.simulationAttempted

    local headlessReady =
        recipesReady
        and operationsReady
        and simulationsReady
        and summary.allUIHidden

    PT.Print(
        string.format(
            "Headless-Probe Ergebnis · UI=%s · Recipes=%s · Baseline=%s · Operations=%s %d/%d · Simulations=%s %d/%d",
            hiddenLabel(
                not summary.allUIHidden
            ),
            readyLabel(
                recipesReady
            ),
            baselineSummary(
                summary
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

    if headlessReady then
        PT.Print(
            "Headless-Capture ist technisch bereit; automatischer Login-Sync kann als nächsten Schritt aktiviert werden."
        )

        return true
    end

    PT.Print(
        "Headless-Capture wird noch nicht aktiviert; bestehende Captures bleiben unverändert."
    )

    return false
end