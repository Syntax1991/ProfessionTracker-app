local _, PT = ...

local STORAGE_FORMAT =
    "BASE_DELTA_CATALOG_REF_V1"

local function getMetric(
    baseMetrics,
    operationMetrics,
    key,
    operationIsDelta
)
    if type(operationMetrics) == "table"
        and operationMetrics[key] ~= nil
    then
        return operationMetrics[key]
    end

    if operationIsDelta
        and type(baseMetrics) == "table"
    then
        return baseMetrics[key]
    end

    return nil
end

local function getUpperSkillThreshold(
    baseMetrics,
    operationMetrics,
    operationIsDelta
)
    return getMetric(
        baseMetrics,
        operationMetrics,
        "upperSkillTreshold",
        operationIsDelta
    )
        or getMetric(
            baseMetrics,
            operationMetrics,
            "upperSkillThreshold",
            operationIsDelta
        )
end

local function isSafeOperation(
    baseMetrics,
    operationMetrics,
    operationIsDelta
)
    if type(operationMetrics) ~= "table" then
        return false
    end

    local craftingQualityID =
        getMetric(
            baseMetrics,
            operationMetrics,
            "craftingQualityID",
            operationIsDelta
        )

    local lowerSkillThreshold =
        getMetric(
            baseMetrics,
            operationMetrics,
            "lowerSkillThreshold",
            operationIsDelta
        )

    local upperSkillThreshold =
        getUpperSkillThreshold(
            baseMetrics,
            operationMetrics,
            operationIsDelta
        )

    if craftingQualityID == 0
        and lowerSkillThreshold == 0
        and upperSkillThreshold == 0
    then
        return true
    end

    local baseDifficulty =
        getMetric(
            baseMetrics,
            operationMetrics,
            "baseDifficulty",
            operationIsDelta
        )

    local baseSkill =
        getMetric(
            baseMetrics,
            operationMetrics,
            "baseSkill",
            operationIsDelta
        )

    local bonusSkill =
        getMetric(
            baseMetrics,
            operationMetrics,
            "bonusSkill",
            operationIsDelta
        )

    return type(baseDifficulty) == "number"
        and baseDifficulty > 0
        and type(baseSkill) == "number"
        and type(bonusSkill) == "number"
        and (
            baseSkill + bonusSkill
        ) >= baseDifficulty
end

local function sortValue(
    scenario,
    key,
    fallback
)
    if type(scenario) ~= "table" then
        return fallback
    end

    local value =
        scenario[key]

    if value == nil then
        return fallback
    end

    return value
end

local function comesBefore(
    left,
    right
)
    local leftScore =
        sortValue(
            left,
            "qualityScore",
            math.huge
        )

    local rightScore =
        sortValue(
            right,
            "qualityScore",
            math.huge
        )

    if leftScore ~= rightScore then
        return leftScore < rightScore
    end

    local leftSignature =
        tostring(
            sortValue(
                left,
                "qualitySignature",
                ""
            )
        )

    local rightSignature =
        tostring(
            sortValue(
                right,
                "qualitySignature",
                ""
            )
        )

    if leftSignature ~= rightSignature then
        return leftSignature < rightSignature
    end

    return sortValue(
        left,
        "scenarioIndex",
        math.huge
    ) < sortValue(
        right,
        "scenarioIndex",
        math.huge
    )
end

function PT.SelectCharacterRecipeStorageScenarios(
    baseMetrics,
    source
)
    if type(source) ~= "table" then
        return nil,
            nil,
            false
    end

    local operationIsDelta =
        source.storageFormat
        == STORAGE_FORMAT

    local lowestIsSafe =
        isSafeOperation(
            baseMetrics,
            source.lowestQualityOperation,
            operationIsDelta
        )

    local minimumSafe = nil
    local maximumCaptured = nil

    for _, scenario in ipairs(
        source.qualityScenarios
        or {}
    ) do
        if type(scenario) == "table"
            and type(scenario.operationMetrics)
                == "table"
        then
            if not maximumCaptured
                or comesBefore(
                    maximumCaptured,
                    scenario
                )
            then
                maximumCaptured =
                    scenario
            end

            if isSafeOperation(
                baseMetrics,
                scenario.operationMetrics,
                operationIsDelta
            )
                and (
                    not minimumSafe
                    or comesBefore(
                        scenario,
                        minimumSafe
                    )
                )
            then
                minimumSafe =
                    scenario
            end
        end
    end

    return minimumSafe,
        maximumCaptured,
        lowestIsSafe
end