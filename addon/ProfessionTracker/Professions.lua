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

function PT.CollectProfessions()
    local primaryOne,
        primaryTwo =
        GetProfessions()

    local professionIndexes = {
        primaryOne,
        primaryTwo
    }

    local professions = {}

    for _,
        professionIndex
        in ipairs(
            professionIndexes
        )
    do
        local profession =
            createProfessionSnapshot(
                professionIndex
            )

        if profession then
            table.insert(
                professions,
                profession
            )
        end
    end

    table.sort(
        professions,
        function(
            left,
            right
        )
            return left.name
                < right.name
        end
    )

    return professions
end