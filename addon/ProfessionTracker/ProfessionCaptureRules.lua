local _, PT = ...

local REFRESH_DAYS = 7
local SECONDS_PER_DAY = 24 * 60 * 60

PT.PROFESSION_CAPTURE_REFRESH_DAYS =
    REFRESH_DAYS

PT.PROFESSION_CAPTURE_REFRESH_SECONDS =
    REFRESH_DAYS
    * SECONDS_PER_DAY

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
    return PT.IsTrackedProfessionExpansion(
        expansion
    )
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

        if PT.IsTrackedProfessionExpansion(
            activeExpansion
        ) then
            return activeExpansion
        end
    end

    for _, expansion in pairs(
        profession.expansions
    ) do
        if PT.IsTrackedProfessionExpansion(
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

function PT.GetProfessionCaptureReminderState(
    status,
    currentTime
)
    if type(status) ~= "table" then
        return "MISSING",
            nil
    end

    if status.state ~= "CAPTURED" then
        return "MISSING",
            nil
    end

    local capturedAt =
        tonumber(
            status.capturedAt
        )

    if not capturedAt
        or capturedAt <= 0
    then
        return "MISSING",
            nil
    end

    local now =
        tonumber(
            currentTime
        )
        or time()

    local ageSeconds =
        math.max(
            now - capturedAt,
            0
        )

    if ageSeconds
        >= PT.PROFESSION_CAPTURE_REFRESH_SECONDS
    then
        return "OUTDATED",
            ageSeconds
    end

    return nil,
        ageSeconds
end