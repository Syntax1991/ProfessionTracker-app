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

local function isMidnightExpansion(expansion)
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

local function findMidnightExpansion(profession)
    if type(profession.expansions) ~= "table" then
        return nil
    end

    local activeSkillLineID =
        profession.activeExpansionSkillLineId

    if activeSkillLineID then
        local expansion =
            profession.expansions[
                tostring(activeSkillLineID)
            ]
            or profession.expansions[
                activeSkillLineID
            ]

        if expansion
            and isMidnightExpansion(
                expansion
            )
        then
            return expansion
        end
    end

    for _, expansion in pairs(
        profession.expansions
    ) do
        if isMidnightExpansion(
            expansion
        ) then
            return expansion
        end
    end

    return nil
end

local function findOperationCapture(
    characterKey,
    profession
)
    local database =
        PT.EnsureDatabase()

    local captures =
        database.characterRecipeOperations[
            characterKey
        ]

    if type(captures) ~= "table" then
        return nil
    end

    local activeSkillLineID =
        profession.activeExpansionSkillLineId

    if activeSkillLineID then
        local capture =
            captures[
                tostring(activeSkillLineID)
            ]
            or captures[
                activeSkillLineID
            ]

        if capture then
            return capture
        end
    end

    for _, capture in pairs(
        captures
    ) do
        if type(capture) == "table"
            and capture.parentSkillLineId
                == profession.skillLineId
        then
            return capture
        end
    end

    return nil
end

local function hasRecipes(expansion)
    return type(expansion) == "table"
        and type(expansion.recipeIds) == "table"
end

local function applyOperationCapture(
    status,
    capture
)
    local learnedRecipeCount =
        capture.learnedRecipeCount
        or 0

    local operationRecipeCount =
        capture.operationRecipeCount
        or 0

    local unavailableCount =
        capture.operationUnavailableCount

    if unavailableCount == nil then
        unavailableCount =
            math.max(
                learnedRecipeCount
                    - operationRecipeCount,
                0
            )
    end

    status.captureVersion =
        capture.captureVersion
        or 1

    status.expansionSkillLineId =
        capture.skillLineId
        or status.expansionSkillLineId

    status.learnedRecipeCount =
        learnedRecipeCount

    status.operationAttemptedCount =
        capture.operationAttemptedCount
        or learnedRecipeCount

    status.operationRecipeCount =
        operationRecipeCount

    status.operationUnavailableCount =
        unavailableCount

    status.captureLevel =
        "OPERATIONS"

    if status.captureVersion == 1
        or status.captureVersion
            == PT.CHARACTER_RECIPE_OPERATION_CAPTURE_VERSION
    then
        status.state =
            "CAPTURED"

        return
    end

    status.state =
        "STALE"
end

local function createProfessionStatus(
    characterKey,
    profession
)
    local expansion =
        findMidnightExpansion(
            profession
        )

    local operationCapture =
        findOperationCapture(
            characterKey,
            profession
        )

    local status = {
        professionName =
            profession.name
            or "Unknown profession",

        professionSkillLineId =
            profession.skillLineId,

        expansionSkillLineId =
            expansion
            and expansion.skillLineId
            or nil,

        captureVersion =
            nil,

        captureLevel =
            "BASIC",

        state =
            "MISSING",

        learnedRecipeCount =
            nil,

        operationAttemptedCount =
            nil,

        operationRecipeCount =
            nil,

        operationUnavailableCount =
            nil
    }

    if expansion then
        status.captureLevel =
            "EXPANSION"

        status.expansionSkillLineId =
            expansion.skillLineId
            or status.expansionSkillLineId
    end

    if hasRecipes(expansion) then
        status.captureLevel =
            "RECIPES"
    end

    if operationCapture then
        applyOperationCapture(
            status,
            operationCapture
        )
    end

    return status
end

local function getCurrentCharacter()
    local database =
        PT.EnsureDatabase()

    local characterKey =
        PT.GetCurrentCharacterStorageKey()

    return database.characters[
        characterKey
    ],
        characterKey
end

function PT.GetCurrentProfessionCaptureStatuses()
    local character,
        characterKey =
        getCurrentCharacter()

    local statuses = {}

    if not character
        or type(character.professions) ~= "table"
    then
        return statuses
    end

    for _, profession in ipairs(
        character.professions
    ) do
        local skillLineID =
            profession.skillLineId

        if skillLineID
            and craftingProfessionSkillLines[
                skillLineID
            ]
            and (
                profession.skillLevel
                or 0
            ) > 0
        then
            table.insert(
                statuses,
                createProfessionStatus(
                    characterKey,
                    profession
                )
            )
        end
    end

    table.sort(
        statuses,
        function(left, right)
            return left.professionName
                < right.professionName
        end
    )

    return statuses
end