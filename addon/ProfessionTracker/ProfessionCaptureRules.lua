local _, PT = ...

local craftingProfessionSkillLines = {
    [164] = true,
    [165] = true,
    [171] = true,
    [197] = true,
    [202] = true,
    [333] = true,
    [755] = true,
    [773] = true
}

function PT.IsSupportedCraftingProfession(
    skillLineID
)
    return skillLineID ~= nil
        and craftingProfessionSkillLines[
            skillLineID
        ] == true
end

function PT.IsMidnightProfessionExpansion(
    expansion
)
    if type(expansion) ~= "table" then
        return false
    end

    local expansionName =
        expansion.expansionName
        or expansion.displayName

    if type(expansionName) ~= "string" then
        return false
    end

    return string.find(
        string.lower(expansionName),
        "midnight",
        1,
        true
    ) ~= nil
end

function PT.FindMidnightProfessionExpansion(
    profession
)
    if not profession
        or type(profession.expansions) ~= "table"
    then
        return nil
    end

    local activeSkillLineID =
        profession.activeExpansionSkillLineId

    if activeSkillLineID then
        local activeExpansion =
            profession.expansions[
                tostring(activeSkillLineID)
            ]
            or profession.expansions[
                activeSkillLineID
            ]

        if PT.IsMidnightProfessionExpansion(
            activeExpansion
        ) then
            return activeExpansion
        end
    end

    for _, expansion in pairs(
        profession.expansions
    ) do
        if PT.IsMidnightProfessionExpansion(
            expansion
        ) then
            return expansion
        end
    end

    return nil
end

function PT.ProfessionExpansionHasRecipes(
    expansion
)
    return type(expansion) == "table"
        and type(expansion.recipeIds) == "table"
end