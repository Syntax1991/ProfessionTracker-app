local _, PT = ...

local STORAGE_FORMAT = "C1"

PT.CHARACTER_RECIPE_OPERATION_STORAGE_FORMAT =
    STORAGE_FORMAT

local metricKeys = {
    "guaranteedCraftingQualityID",
    "baseDifficulty",
    "upperSkillTreshold",
    "upperSkillThreshold",
    "lowerSkillThreshold",
    "baseSkill",
    "concentrationCost",
    "bonusDifficulty",
    "craftingQualityID",
    "ingenuityRefund",
    "craftingQuality",
    "isQualityCraft",
    "concentrationCurrencyID",
    "bonusSkill",
    "quality"
}

local metricKeySet = {}

for _, key in ipairs(metricKeys) do
    metricKeySet[key] = true
end

local function isScalar(value)
    local valueType = type(value)

    return valueType == "number"
        or valueType == "string"
        or valueType == "boolean"
end

local function encodeText(value)
    return string.gsub(
        tostring(value),
        "([^%w%._%-])",
        function(character)
            return string.format(
                "%%%02X",
                string.byte(character)
            )
        end
    )
end

local function encodeScalar(value)
    local valueType = type(value)

    if valueType == "number" then
        return "n" .. tostring(value)
    end

    if valueType == "boolean" then
        return value and "b1" or "b0"
    end

    if valueType == "string" then
        return "s" .. encodeText(value)
    end

    return "x"
end

local function encodeGenericMap(source)
    local result = {}

    for key, value in pairs(source or {}) do
        if type(key) == "string"
            and isScalar(value)
        then
            table.insert(
                result,
                encodeText(key)
                    .. "="
                    .. encodeScalar(value)
            )
        end
    end

    table.sort(result)

    if #result == 0 then
        return "-"
    end

    return table.concat(result, "&")
end

local function encodeMetricMap(source)
    if type(source) ~= "table"
        or next(source) == nil
    then
        return "-"
    end

    local fixed = {}
    local extras = {}

    for _, key in ipairs(metricKeys) do
        table.insert(
            fixed,
            encodeScalar(source[key])
        )
    end

    for key, value in pairs(source) do
        if type(key) == "string"
            and not metricKeySet[key]
            and isScalar(value)
        then
            table.insert(
                extras,
                encodeText(key)
                    .. "="
                    .. encodeScalar(value)
            )
        end
    end

    table.sort(extras)

    return table.concat(fixed, ",")
        .. ";"
        .. table.concat(extras, ",")
end

local function encodeSelection(selection)
    if type(selection) ~= "table" then
        return nil
    end

    if type(selection.slotIndex) == "number"
        and type(selection.candidateIndex) == "number"
    then
        return "r"
            .. tostring(selection.slotIndex)
            .. "."
            .. tostring(selection.candidateIndex)
    end

    return "m" .. encodeGenericMap(selection)
end

local function encodeSelections(selections)
    local result = {}

    for _, selection in ipairs(
        selections or {}
    ) do
        local encoded =
            encodeSelection(selection)

        if encoded then
            table.insert(result, encoded)
        end
    end

    if #result == 0 then
        return "-"
    end

    return table.concat(result, "/")
end

local function encodeScenario(scenario)
    if type(scenario) ~= "table" then
        return nil
    end

    return table.concat(
        {
            encodeScalar(scenario.qualityScore),
            encodeSelections(scenario.selections),
            encodeMetricMap(
                scenario.operationMetrics
            ),
            encodeScalar(scenario.scenarioIndex),
            encodeScalar(
                scenario.qualitySignature
            )
        },
        "~"
    )
end

local function encodeScenarios(scenarios)
    local result = {}

    for _, scenario in ipairs(
        scenarios or {}
    ) do
        local encoded =
            encodeScenario(scenario)

        if encoded then
            table.insert(result, encoded)
        end
    end

    if #result == 0 then
        return "-"
    end

    return table.concat(result, "!")
end

local function encodeSimulationMeta(source)
    if type(source) ~= "table" then
        return "0"
    end

    return table.concat(
        {
            "1",
            encodeScalar(source.captureVersion),
            encodeScalar(source.status),
            encodeScalar(
                source.requiredModifiedSlotCount
            ),
            encodeScalar(source.simulatedSlotCount),
            encodeScalar(source.qualitySlotCount),
            encodeScalar(
                source.concentrationCaptured
            ),
            encodeScalar(
                source.qualityScenarioStatus
            ),
            encodeScalar(
                source.qualityScenarioLimit
            ),
            encodeScalar(
                source.qualityScenarioCombinationCount
            ),
            encodeScalar(
                source.qualityScenarioCapturedCount
            )
        },
        ","
    )
end

local function isEncodedRecipe(value)
    return type(value) == "string"
        and string.sub(value, 1, 3)
            == STORAGE_FORMAT .. "|"
end

function PT.EncodeCompactCharacterRecipeOperation(
    source,
    fallbackRecipeID
)
    if isEncodedRecipe(source) then
        return source
    end

    if type(source) ~= "table" then
        return nil
    end

    local recipeID =
        source.recipeId
        or fallbackRecipeID

    if type(recipeID) ~= "number" then
        return nil
    end

    local operationMetrics =
        source.operationMetrics

    if type(operationMetrics) ~= "table"
        or next(operationMetrics) == nil
    then
        return nil
    end

    local simulation =
        source.reagentSimulation

    local parts = {
        STORAGE_FORMAT,
        tostring(recipeID),
        encodeMetricMap(operationMetrics),
        encodeSimulationMeta(simulation),
        "-",
        "-",
        "-",
        "-"
    }

    if type(simulation) == "table" then
        parts[5] =
            encodeMetricMap(
                simulation.lowestQualityOperation
            )

        parts[6] =
            encodeMetricMap(
                simulation.highestQualityOperation
            )

        parts[7] =
            encodeMetricMap(
                simulation
                    .highestQualityConcentrationOperation
            )

        parts[8] =
            encodeScenarios(
                simulation.qualityScenarios
            )
    end

    return table.concat(parts, "|")
end

function PT.IsCompactCharacterRecipeOperation(
    value
)
    return isEncodedRecipe(value)
end