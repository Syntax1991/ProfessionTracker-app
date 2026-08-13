local _, PT = ...

local function collectPrimaryProfessions()
    local primaryOne,
        primaryTwo =
        GetProfessions()

    return {
        primaryOne,
        primaryTwo
    }
end

local function buildProfessions(
    professionIndexes,
    existingBySkillLineId
)
    local professions = {}

    for _, professionIndex in ipairs(
        professionIndexes
    ) do
        local profession =
            PT.CreateProfessionSnapshot(
                professionIndex
            )

        if profession then
            PT.PreserveProfessionCapturedData(
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

    return professions
end

local function applyAutomaticData(
    professions
)
    if PT.ApplyAutomaticProfessionSpecializations then
        PT.ApplyAutomaticProfessionSpecializations(
            professions
        )
    end
end

local function applyOpenProfessionData(
    professions
)
    if PT.ApplyOpenProfessionSpecializationData then
        PT.ApplyOpenProfessionSpecializationData(
            professions
        )
    end

    if PT.ApplyOpenProfessionRecipes then
        PT.ApplyOpenProfessionRecipes(
            professions
        )
    end
end

local function sortProfessions(
    professions
)
    table.sort(
        professions,
        function(left, right)
            return left.name
                < right.name
        end
    )
end

function PT.CollectProfessions(
    existingProfessions
)
    local professionIndexes =
        collectPrimaryProfessions()

    local existingBySkillLineId =
        PT.IndexExistingProfessions(
            existingProfessions
        )

    local professions =
        buildProfessions(
            professionIndexes,
            existingBySkillLineId
        )

    applyAutomaticData(
        professions
    )

    applyOpenProfessionData(
        professions
    )

    sortProfessions(
        professions
    )

    return professions
end