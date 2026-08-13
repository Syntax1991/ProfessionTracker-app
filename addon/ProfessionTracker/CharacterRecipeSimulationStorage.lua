local _, PT = ...

local STORAGE_FORMAT =
    "BASE_DELTA_CATALOG_REF_V1"

PT.CHARACTER_RECIPE_SIMULATION_STORAGE_FORMAT =
    STORAGE_FORMAT

local excludedMetricKeys = {
    recipeID = true,
    craftingDataID = true
}

local function isScalarValue(
    value
)
    local valueType =
        type(value)

    return valueType == "number"
        or valueType == "string"
        or valueType == "boolean"
end

local function copyScalarTable(
    source
)
    local result = {}

    for key, value in pairs(
        source
        or {}
    ) do
        if type(key) == "string"
            and isScalarValue(
                value
            )
        then
            result[key] =
                value
        end
    end

    return result
end

local function createOperationDelta(
    baseMetrics,
    operationMetrics
)
    if type(operationMetrics) ~= "table" then
        return nil
    end

    local result = {}

    for key, value in pairs(
        operationMetrics
    ) do
        if type(key) == "string"
            and not excludedMetricKeys[
                key
            ]
            and isScalarValue(
                value
            )
            and (
                type(baseMetrics) ~= "table"
                or baseMetrics[key] ~= value
            )
        then
            result[key] =
                value
        end
    end

    return result
end

local function createSelectionReference(
    selection
)
    if type(selection) ~= "table" then
        return nil,
            false
    end

    local slotIndex =
        selection.slotIndex

    local candidateIndex =
        selection.candidateIndex

    if type(slotIndex) == "number"
        and type(candidateIndex) == "number"
    then
        return {
            slotIndex =
                slotIndex,

            candidateIndex =
                candidateIndex
        },
        true
    end

    return copyScalarTable(
        selection
    ),
        false
end

local function createSelectionReferences(
    selections
)
    local result = {}
    local allReferenced = true

    for _, selection in ipairs(
        selections
        or {}
    ) do
        local compactSelection,
            referenced =
            createSelectionReference(
                selection
            )

        if compactSelection then
            table.insert(
                result,
                compactSelection
            )
        end

        if not referenced then
            allReferenced = false
        end
    end

    return result,
        allReferenced
end

local function createCompactScenario(
    scenario,
    baseMetrics
)
    if type(scenario) ~= "table" then
        return nil
    end

    local selections,
        allReferenced =
        createSelectionReferences(
            scenario.selections
        )

    local result = {
        qualityScore =
            scenario.qualityScore,

        selections =
            selections,

        operationMetrics =
            createOperationDelta(
                baseMetrics,
                scenario.operationMetrics
            )
    }

    if not allReferenced then
        result.scenarioIndex =
            scenario.scenarioIndex

        result.qualitySignature =
            scenario.qualitySignature
    end

    return result
end

local function createWinnerScenarios(
    source,
    baseMetrics
)
    if not PT.SelectCharacterRecipeStorageScenarios then
        return {}
    end

    local minimumSafe,
        maximumCaptured,
        lowestIsSafe =
        PT.SelectCharacterRecipeStorageScenarios(
            baseMetrics,
            source
        )

    if lowestIsSafe
        or not minimumSafe
    then
        return {}
    end

    local minimumScore =
        minimumSafe.qualityScore

    local maximumScore =
        maximumCaptured
        and maximumCaptured.qualityScore
        or nil

    if maximumCaptured
        and (
            type(minimumScore) ~= "number"
            or type(maximumScore) ~= "number"
            or minimumScore >= maximumScore
        )
    then
        return {}
    end

    local result = {}

    local compactMinimum =
        createCompactScenario(
            minimumSafe,
            baseMetrics
        )

    if compactMinimum then
        table.insert(
            result,
            compactMinimum
        )
    end

    if maximumCaptured
        and maximumCaptured
            ~= minimumSafe
    then
        local compactMaximum =
            createCompactScenario(
                maximumCaptured,
                baseMetrics
            )

        if compactMaximum then
            table.insert(
                result,
                compactMaximum
            )
        end
    end

    return result
end

function PT.CreateCompactCharacterRecipeSimulation(
    baseMetrics,
    source
)
    if type(source) ~= "table" then
        return nil
    end

    return {
        captureVersion =
            source.captureVersion,

        status =
            source.status,

        requiredModifiedSlotCount =
            source.requiredModifiedSlotCount,

        simulatedSlotCount =
            source.simulatedSlotCount,

        qualitySlotCount =
            source.qualitySlotCount,

        concentrationCaptured =
            source.concentrationCaptured
            == true
            and true
            or nil,

        qualityScenarioStatus =
            source.qualityScenarioStatus,

        qualityScenarioLimit =
            source.qualityScenarioLimit,

        qualityScenarioCombinationCount =
            source.qualityScenarioCombinationCount,

        qualityScenarioCapturedCount =
            source.qualityScenarioCapturedCount,

        storageFormat =
            STORAGE_FORMAT,

        lowestQualityOperation =
            createOperationDelta(
                baseMetrics,
                source.lowestQualityOperation
            ),

        highestQualityOperation =
            createOperationDelta(
                baseMetrics,
                source.highestQualityOperation
            ),

        highestQualityConcentrationOperation =
            createOperationDelta(
                baseMetrics,
                source.highestQualityConcentrationOperation
            ),

        qualityScenarios =
            createWinnerScenarios(
                source,
                baseMetrics
            )
    }
end