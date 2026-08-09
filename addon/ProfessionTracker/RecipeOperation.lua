local _, PT = ...

local function isScalarValue(
    value
)
    local valueType =
        type(value)

    return valueType == "number"
        or valueType == "string"
        or valueType == "boolean"
end

local function copyScalarMetrics(
    operationInfo
)
    local metrics = {}

    for key, value in pairs(
        operationInfo
    ) do
        if type(key) == "string"
            and isScalarValue(
                value
            )
        then
            metrics[key] =
                value
        end
    end

    if next(metrics) == nil then
        return nil
    end

    return metrics
end

function PT.GetRecipeOperationSnapshot(
    recipeID
)
    if not recipeID
        or not C_TradeSkillUI
        or not C_TradeSkillUI.GetCraftingOperationInfo
    then
        return nil
    end

    local success,
        operationInfo =
        pcall(
            C_TradeSkillUI.GetCraftingOperationInfo,
            recipeID,
            {},
            nil,
            false
        )

    if not success
        or type(operationInfo) ~= "table"
    then
        return nil
    end

    return copyScalarMetrics(
        operationInfo
    )
end

function PT.GetRecipeBaseDifficulty(
    recipeID
)
    local operationMetrics =
        PT.GetRecipeOperationSnapshot(
            recipeID
        )

    local baseDifficulty =
        operationMetrics
        and operationMetrics.baseDifficulty
        or nil

    if type(baseDifficulty) ~= "number"
        or baseDifficulty < 0
    then
        return nil
    end

    return baseDifficulty
end