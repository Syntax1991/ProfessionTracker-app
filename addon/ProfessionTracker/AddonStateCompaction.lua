local _, PT = ...

local function copyTrackedMap(
    source
)
    local result = {}

    for key, value in pairs(
        source
        or {}
    ) do
        if PT.IsTrackedProfessionExpansion(
            value
        ) then
            result[key] =
                value
        end
    end

    return result
end

local function resolveActiveExpansion(
    profession
)
    local expansions =
        profession.expansions
        or {}

    local activeSkillLineId =
        profession.activeExpansionSkillLineId

    if activeSkillLineId then
        local activeExpansion =
            expansions[
                tostring(
                    activeSkillLineId
                )
            ]
            or expansions[
                activeSkillLineId
            ]

        if PT.IsTrackedProfessionExpansion(
            activeExpansion
        ) then
            return activeSkillLineId
        end
    end

    for key, expansion in pairs(
        expansions
    ) do
        if PT.IsTrackedProfessionExpansion(
            expansion
        ) then
            return expansion.skillLineId
                or tonumber(key)
        end
    end

    return nil
end

local function compactProfession(
    profession
)
    if type(profession) ~= "table" then
        return
    end

    profession.expansions =
        copyTrackedMap(
            profession.expansions
        )

    profession.activeExpansionSkillLineId =
        resolveActiveExpansion(
            profession
        )

    profession.recipes = nil
    profession.childSkillLineId = nil
    profession.specializationConfigId = nil
    profession.hasSpecialization = nil
    profession.knowledge = nil
    profession.specializationCapturedAt = nil
end

local function compactCharacter(
    character
)
    if type(character) ~= "table" then
        return
    end

    for _, profession in ipairs(
        character.professions
        or {}
    ) do
        compactProfession(
            profession
        )
    end

    character.recipes = nil
    character.specializations = nil
end

local function compactCharacters(
    database
)
    for _, character in pairs(
        database.characters
        or {}
    ) do
        compactCharacter(
            character
        )
    end
end

local function compactCharacterRecipeOperations(
    database
)
    local compacted = {}

    for characterKey, captures in pairs(
        database.characterRecipeOperations
        or {}
    ) do
        local trackedCaptures =
            copyTrackedMap(
                captures
            )

        if next(trackedCaptures) ~= nil then
            compacted[
                characterKey
            ] =
                trackedCaptures
        end
    end

    database.characterRecipeOperations =
        compacted
end

function PT.CompactCurrentAddonState(
    database
)
    if type(database) ~= "table" then
        return
    end

    database.professionCatalog =
        copyTrackedMap(
            database.professionCatalog
        )

    database.recipeCatalog =
        copyTrackedMap(
            database.recipeCatalog
        )

    compactCharacters(
        database
    )

    compactCharacterRecipeOperations(
        database
    )
end

local function getActiveProfessionIds(
    professions
)
    local result = {}

    for _, profession in ipairs(
        professions
        or {}
    ) do
        if profession.skillLineId then
            result[
                profession.skillLineId
            ] = true
        end
    end

    return result
end

function PT.PruneCharacterRecipeOperationsForProfessions(
    characterKey,
    professions
)
    if not characterKey then
        return
    end

    local database =
        PT.EnsureDatabase()

    local store =
        database.characterRecipeOperations[
            characterKey
        ]

    if type(store) ~= "table" then
        return
    end

    local activeProfessionIds =
        getActiveProfessionIds(
            professions
        )

    for key, capture in pairs(
        store
    ) do
        local keep =
            PT.IsTrackedProfessionExpansion(
                capture
            )

        local parentSkillLineId =
            type(capture) == "table"
            and capture.parentSkillLineId
            or nil

        if keep
            and parentSkillLineId
            and not activeProfessionIds[
                parentSkillLineId
            ]
        then
            keep = false
        end

        if not keep then
            store[key] = nil
        end
    end

    if next(store) == nil then
        database.characterRecipeOperations[
            characterKey
        ] = nil
    end
end