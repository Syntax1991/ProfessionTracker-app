local _, PT = ...

function PT.CreateProfessionSnapshot(
    professionIndex
)
    if not professionIndex then
        return nil
    end

    local name,
        icon,
        skillLevel,
        maxSkillLevel,
        _,
        _,
        skillLineId,
        skillModifier =
        GetProfessionInfo(
            professionIndex
        )

    if not name then
        return nil
    end

    return {
        name = name,

        icon =
            icon
            or 0,

        skillLevel =
            skillLevel
            or 0,

        maxSkillLevel =
            maxSkillLevel
            or 0,

        skillLineId =
            skillLineId
            or 0,

        skillModifier =
            skillModifier
            or 0,

        expansions = {},
        recipes = {}
    }
end

function PT.IndexExistingProfessions(
    professions
)
    local bySkillLineId = {}

    for _, profession in ipairs(
        professions
        or {}
    ) do
        if profession.skillLineId then
            bySkillLineId[
                profession.skillLineId
            ] =
                profession
        end
    end

    return bySkillLineId
end

local function createLegacyExpansion(
    existingProfession
)
    if not existingProfession
        or not existingProfession.childSkillLineId
    then
        return nil
    end

    return {
        skillLineId =
            existingProfession.childSkillLineId,

        configId =
            existingProfession.specializationConfigId,

        hasSpecialization =
            existingProfession.hasSpecialization,

        knowledge =
            existingProfession.knowledge,

        specializations =
            existingProfession.specializations
            or {},

        capturedAt =
            existingProfession.specializationCapturedAt
    }
end

local function compactExpansion(
    expansion
)
    if PT.CompactStoredExpansion then
        return PT.CompactStoredExpansion(
            expansion
        )
    end

    return expansion
end

function PT.PreserveProfessionCapturedData(
    profession,
    existingProfession
)
    if not existingProfession then
        return
    end

    profession.recipes =
        existingProfession.recipes
        or {}

    if PT.CompactStoredExpansions then
        profession.expansions =
            PT.CompactStoredExpansions(
                existingProfession.expansions
            )
    else
        profession.expansions =
            existingProfession.expansions
            or {}
    end

    local legacyExpansion =
        createLegacyExpansion(
            existingProfession
        )

    if legacyExpansion then
        local legacyKey =
            tostring(
                legacyExpansion.skillLineId
            )

        if not profession.expansions[
            legacyKey
        ] then
            profession.expansions[
                legacyKey
            ] =
                compactExpansion(
                    legacyExpansion
                )
        end
    end

    profession.activeExpansionSkillLineId =
        existingProfession.activeExpansionSkillLineId
        or existingProfession.childSkillLineId
end

local function namesMatch(
    left,
    right
)
    if not left
        or not right
    then
        return false
    end

    return PT.NormalizeKeyPart(
        left
    )
        ==
        PT.NormalizeKeyPart(
            right
        )
end

local function matchesOpenProfession(
    profession,
    specializationData
)
    if specializationData.parentSkillLineId
        and specializationData.parentSkillLineId ~= 0
    then
        return profession.skillLineId
            == specializationData.parentSkillLineId
    end

    if specializationData.parentProfessionName then
        return namesMatch(
            profession.name,
            specializationData.parentProfessionName
        )
    end

    return false
end

local function createExpansionSnapshot(
    specializationData
)
    if PT.CreateCompactExpansionSnapshot then
        return PT.CreateCompactExpansionSnapshot(
            specializationData
        )
    end

    return {
        skillLineId =
            specializationData.skillLineId,

        displayName =
            specializationData.displayName,

        expansionName =
            specializationData.expansionName,

        configId =
            specializationData.configId,

        available =
            specializationData.available,

        hasSpecialization =
            specializationData.hasSpecialization,

        knowledge =
            specializationData.knowledge,

        capturedAt =
            specializationData.capturedAt
    }
end

function PT.ApplyOpenProfessionSpecializationData(
    professions
)
    if not PT.CollectOpenProfessionSpecializations then
        return
    end

    local specializationData =
        PT.CollectOpenProfessionSpecializations()

    if not specializationData then
        return
    end

    for _, profession in ipairs(
        professions
        or {}
    ) do
        if matchesOpenProfession(
            profession,
            specializationData
        ) then
            profession.expansions =
                profession.expansions
                or {}

            local expansionKey =
                tostring(
                    specializationData.skillLineId
                )

            profession.expansions[
                expansionKey
            ] =
                createExpansionSnapshot(
                    specializationData
                )

            profession.activeExpansionSkillLineId =
                specializationData.skillLineId

            return
        end
    end
end