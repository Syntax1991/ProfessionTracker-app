local _, PT = ...

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

local function matchesProfession(
    profession,
    snapshot
)
    if snapshot.parentSkillLineId
        and snapshot.parentSkillLineId ~= 0
    then
        return profession.skillLineId
            == snapshot.parentSkillLineId
    end

    if snapshot.parentProfessionName then
        return namesMatch(
            profession.name,
            snapshot.parentProfessionName
        )
    end

    return false
end

local function applyRecipeSnapshot(
    profession,
    snapshot
)
    profession.expansions =
        profession.expansions
        or {}

    local expansionKey =
        tostring(
            snapshot.skillLineId
        )

    local expansion =
        profession.expansions[
            expansionKey
        ]
        or {}

    expansion.skillLineId =
        snapshot.skillLineId

    if not expansion.displayName then
        expansion.displayName =
            snapshot.displayName
    end

    if not expansion.expansionName then
        expansion.expansionName =
            snapshot.expansionName
    end

    expansion.recipeIds =
        snapshot.learnedRecipeIds

    expansion.recipeCapturedAt =
        snapshot.capturedAt

    profession.expansions[
        expansionKey
    ] =
        expansion

    profession.activeExpansionSkillLineId =
        snapshot.skillLineId
end

function PT.ApplyOpenProfessionRecipes(
    professions
)
    if not PT.GetOpenProfessionContext
        or not PT.CreateOpenProfessionRecipeSnapshot
    then
        return nil
    end

    local context =
        PT.GetOpenProfessionContext()

    if not context
        or not context.skillLineId
        or context.skillLineId == 0
    then
        return nil
    end

    local snapshot =
        PT.CreateOpenProfessionRecipeSnapshot(
            context
        )

    if not snapshot then
        return nil
    end

    for _, profession in ipairs(
        professions
        or {}
    ) do
        if matchesProfession(
            profession,
            snapshot
        ) then
            applyRecipeSnapshot(
                profession,
                snapshot
            )

            return snapshot
        end
    end

    return nil
end