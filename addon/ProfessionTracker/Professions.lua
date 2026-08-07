local _, PT = ...

local function createProfessionSnapshot(
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
        specializations = {},
        recipes = {}
    }
end

local function indexExistingProfessions(
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

local function preserveCapturedData(
    profession,
    existingProfession
)
    if not existingProfession then
        return
    end

    profession.recipes =
        existingProfession.recipes
        or {}

    profession.specializations =
        existingProfession.specializations
        or {}

    profession.childSkillLineId =
        existingProfession.childSkillLineId

    profession.specializationConfigId =
        existingProfession.specializationConfigId

    profession.hasSpecialization =
        existingProfession.hasSpecialization

    profession.knowledge =
        existingProfession.knowledge

    profession.specializationCapturedAt =
        existingProfession.specializationCapturedAt
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

    return PT.NormalizeKeyPart(left)
        == PT.NormalizeKeyPart(right)
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

local function applyOpenSpecializationData(
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
    ) do
        if matchesOpenProfession(
            profession,
            specializationData
        ) then
            profession.childSkillLineId =
                specializationData.skillLineId

            profession.specializationConfigId =
                specializationData.configId

            profession.hasSpecialization =
                specializationData.hasSpecialization

            profession.knowledge =
                specializationData.knowledge

            profession.specializations =
                specializationData.tabs
                or {}

            profession.specializationCapturedAt =
                specializationData.capturedAt

            return
        end
    end
end

function PT.CollectProfessions(
    existingProfessions
)
    local primaryOne,
        primaryTwo =
        GetProfessions()

    local professionIndexes = {
        primaryOne,
        primaryTwo
    }

    local existingBySkillLineId =
        indexExistingProfessions(
            existingProfessions
        )

    local professions = {}

    for _, professionIndex in ipairs(
        professionIndexes
    ) do
        local profession =
            createProfessionSnapshot(
                professionIndex
            )

        if profession then
            preserveCapturedData(
                profession,
                existingBySkillLineId[
                    profession.skillLineId
                ]
            )

            table.insert(
                professions,
                profession
            )
        end
    end

    applyOpenSpecializationData(
        professions
    )

    table.sort(
        professions,
        function(left, right)
            return left.name
                < right.name
        end
    )

    return professions
end