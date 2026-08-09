local _, PT = ...

local function isValidDifficulty(
    value
)
    return type(value) == "number"
        and value >= 0
end

function PT.GetRecipeBaseDifficulty(
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
        or not operationInfo
    then
        return nil
    end

    if not isValidDifficulty(
        operationInfo.baseDifficulty
    ) then
        return nil
    end

    return operationInfo.baseDifficulty
end