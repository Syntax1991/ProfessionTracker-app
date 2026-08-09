local _, PT = ...

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

local function applyOperationCapture(
    status,
    capture
)
    local captureVersion =
        capture.captureVersion
        or 1

    local learnedRecipeCount =
        capture.learnedRecipeCount
        or 0

    local operationEligibleCount =
        capture.operationEligibleCount
        or capture.operationAttemptedCount
        or learnedRecipeCount

    local operationRecipeCount =
        capture.operationRecipeCount
        or 0

    local unavailableCount =
        capture.operationUnavailableCount

    if unavailableCount == nil then
        unavailableCount =
            math.max(
                operationEligibleCount
                    - operationRecipeCount,
                0
            )
    end

    local excludedCount =
        capture.operationExcludedCount

    if excludedCount == nil then
        excludedCount =
            math.max(
                learnedRecipeCount
                    - operationEligibleCount,
                0
            )
    end

    status.captureVersion =
        captureVersion

    status.expansionSkillLineId =
        capture.skillLineId
        or status.expansionSkillLineId

    status.learnedRecipeCount =
        learnedRecipeCount

    status.operationEligibleCount =
        operationEligibleCount

    status.operationAttemptedCount =
        capture.operationAttemptedCount
        or operationEligibleCount

    status.operationRecipeCount =
        operationRecipeCount

    status.operationUnavailableCount =
        unavailableCount

    status.operationExcludedCount =
        excludedCount

    status.captureLevel =
        "OPERATIONS"

    if captureVersion
        == PT.CHARACTER_RECIPE_OPERATION_CAPTURE_VERSION
    then
        status.state =
            "CAPTURED"

        return
    end

    if captureVersion == 1
        or captureVersion == 2
    then
        status.state =
            "LEGACY"

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
        PT.FindMidnightProfessionExpansion(
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

        operationEligibleCount =
            nil,

        operationAttemptedCount =
            nil,

        operationRecipeCount =
            nil,

        operationUnavailableCount =
            nil,

        operationExcludedCount =
            nil
    }

    if expansion then
        status.captureLevel =
            "EXPANSION"

        status.expansionSkillLineId =
            expansion.skillLineId
            or status.expansionSkillLineId
    end

    if PT.ProfessionExpansionHasRecipes(
        expansion
    ) then
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

local function shouldTrackProfession(
    profession
)
    if type(profession) ~= "table" then
        return false
    end

    local skillLineID =
        profession.skillLineId

    if not PT.IsSupportedCraftingProfession(
        skillLineID
    ) then
        return false
    end

    return (
        profession.skillLevel
        or 0
    ) > 0
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
        if shouldTrackProfession(
            profession
        ) then
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