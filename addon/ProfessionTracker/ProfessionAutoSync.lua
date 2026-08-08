local _, PT = ...

local function isCurrentExpansion(
    expansionName
)
    if not expansionName then
        return false
    end

    local normalized =
        PT.NormalizeKeyPart(
            expansionName
        )

    return string.find(
        normalized,
        "midnight",
        1,
        true
    ) ~= nil
end

local function getContext(
    skillLineId
)
    if not PT.GetProfessionContextForSkillLine then
        return nil
    end

    return PT.GetProfessionContextForSkillLine(
        skillLineId
    )
end

local function collectCandidateData(
    profession,
    candidate
)
    if not PT.CollectProfessionSpecializations then
        return nil
    end

    local data =
        PT.CollectProfessionSpecializations(
            candidate.skillLineId
        )

    if not data then
        return nil
    end

    if data.hasSpecialization ~= true then
        return nil
    end

    if data.available == false then
        return nil
    end

    local context =
        getContext(
            candidate.skillLineId
        )

    data.parentSkillLineId =
        profession.skillLineId

    data.parentProfessionName =
        profession.name

    data.displayName =
        context
        and context.displayName
        or candidate.displayName
        or data.displayName

    data.expansionName =
        context
        and context.expansionName
        or candidate.expansionName
        or data.expansionName

    data.capturedAt =
        time()

    return data
end

local function createFallbackSnapshot(
    data
)
    return {
        skillLineId =
            data.skillLineId,

        displayName =
            data.displayName,

        expansionName =
            data.expansionName,

        configId =
            data.configId,

        available =
            data.available,

        hasSpecialization =
            data.hasSpecialization,

        knowledge =
            data.knowledge,

        capturedAt =
            data.capturedAt
    }
end

local function createSnapshot(
    data
)
    if PT.CreateCompactExpansionSnapshot then
        local snapshot =
            PT.CreateCompactExpansionSnapshot(
                data
            )

        if snapshot then
            return snapshot
        end
    end

    return createFallbackSnapshot(
        data
    )
end

local function applyCandidateData(
    profession,
    data
)
    profession.expansions =
        profession.expansions or {}

    local expansionKey =
        tostring(
            data.skillLineId
        )

    profession.expansions[
        expansionKey
    ] =
        createSnapshot(
            data
        )

    if isCurrentExpansion(
        data.expansionName
    ) then
        profession.activeExpansionSkillLineId =
            data.skillLineId

        return
    end

    if not profession.activeExpansionSkillLineId then
        profession.activeExpansionSkillLineId =
            data.skillLineId
    end
end

local function syncProfession(
    profession
)
    if not PT.GetAutomaticProfessionCandidates then
        return 0
    end

    local candidates =
        PT.GetAutomaticProfessionCandidates(
            profession
        )

    local updatedCount = 0

    for _, candidate in pairs(
        candidates
    ) do
        local data =
            collectCandidateData(
                profession,
                candidate
            )

        if data then
            applyCandidateData(
                profession,
                data
            )

            updatedCount =
                updatedCount + 1
        end
    end

    return updatedCount
end

function PT.ApplyAutomaticProfessionSpecializations(
    professions
)
    local updatedCount = 0

    for _, profession in ipairs(
        professions or {}
    ) do
        updatedCount =
            updatedCount
            + syncProfession(
                profession
            )
    end

    return updatedCount
end