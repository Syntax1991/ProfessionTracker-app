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
    context
)
    if context.parentSkillLineId
        and context.parentSkillLineId ~= 0
    then
        return profession.skillLineId
            == context.parentSkillLineId
    end

    if context.parentProfessionName then
        return namesMatch(
            profession.name,
            context.parentProfessionName
        )
    end

    return false
end

local function getRecipeInfo(
    recipeID
)
    if not C_TradeSkillUI
        or not C_TradeSkillUI.GetRecipeInfo
    then
        return nil
    end

    local success,
        recipeInfo =
        pcall(
            C_TradeSkillUI.GetRecipeInfo,
            recipeID
        )

    if not success then
        return nil
    end

    return recipeInfo
end

local function collectRecipes()
    if not C_TradeSkillUI
        or not C_TradeSkillUI.GetAllRecipeIDs
    then
        return nil,
            nil
    end

    local recipeIDs =
        C_TradeSkillUI.GetAllRecipeIDs()
        or {}

    local catalogRecipes = {}
    local learnedRecipeIDs = {}
    local seenRecipeIDs = {}

    for _, recipeID in ipairs(
        recipeIDs
    ) do
        local recipeInfo =
            getRecipeInfo(
                recipeID
            )

        if recipeInfo then
            local resolvedRecipeID =
                recipeInfo.recipeID
                or recipeID

            if resolvedRecipeID
                and not seenRecipeIDs[
                    resolvedRecipeID
                ]
            then
                seenRecipeIDs[
                    resolvedRecipeID
                ] = true

                table.insert(
                    catalogRecipes,
                    {
                        recipeId =
                            resolvedRecipeID,
                        name =
                            recipeInfo.name
                            or (
                                "Recipe "
                                .. tostring(
                                    resolvedRecipeID
                                )
                            ),
                        categoryId =
                            recipeInfo.categoryID
                            or 0
                    }
                )

                if recipeInfo.learned
                    == true
                then
                    table.insert(
                        learnedRecipeIDs,
                        resolvedRecipeID
                    )
                end
            end
        end
    end

    table.sort(
        catalogRecipes,
        function(left, right)
            return left.recipeId
                < right.recipeId
        end
    )

    table.sort(
        learnedRecipeIDs
    )

    return catalogRecipes,
        learnedRecipeIDs
end

local function storeRecipeCatalog(
    context,
    recipes,
    capturedAt
)
    local database =
        PT.EnsureDatabase()

    local catalogKey =
        tostring(
            context.skillLineId
        )

    database.recipeCatalog[
        catalogKey
    ] = {
        skillLineId =
            context.skillLineId,
        displayName =
            context.displayName,
        expansionName =
            context.expansionName,
        recipes =
            recipes,
        capturedAt =
            capturedAt
    }
end

local function createRecipeSnapshot()
    if not PT.GetOpenProfessionContext then
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

    local catalogRecipes,
        learnedRecipeIDs =
        collectRecipes()

    if not catalogRecipes
        or #catalogRecipes == 0
    then
        return nil
    end

    local capturedAt =
        time()

    storeRecipeCatalog(
        context,
        catalogRecipes,
        capturedAt
    )

    return {
        skillLineId =
            context.skillLineId,
        displayName =
            context.displayName,
        expansionName =
            context.expansionName,
        parentSkillLineId =
            context.parentSkillLineId,
        parentProfessionName =
            context.parentProfessionName,
        recipeCount =
            #catalogRecipes,
        learnedRecipeIds =
            learnedRecipeIDs,
        capturedAt =
            capturedAt
    }
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
    local snapshot =
        createRecipeSnapshot()

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