local _, PT = ...

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

local function getCategoryInfo(
    categoryID
)
    if not categoryID
        or categoryID == 0
        or not C_TradeSkillUI
        or not C_TradeSkillUI.GetCategoryInfo
    then
        return nil
    end

    local success,
        categoryInfo =
        pcall(
            C_TradeSkillUI.GetCategoryInfo,
            categoryID
        )

    if not success then
        return nil
    end

    return categoryInfo
end

local function getBaseDifficulty(
    recipeID
)
    if not PT.GetRecipeBaseDifficulty then
        return nil
    end

    return PT.GetRecipeBaseDifficulty(
        recipeID
    )
end

local function createCatalogRecipe(
    recipeID
)
    local recipeInfo =
        getRecipeInfo(
            recipeID
        )

    if not recipeInfo then
        return nil
    end

    local resolvedRecipeID =
        recipeInfo.recipeID
        or recipeID

    if not resolvedRecipeID then
        return nil
    end

    local categoryID =
        recipeInfo.categoryID
        or 0

    local categoryInfo =
        getCategoryInfo(
            categoryID
        )

    local parentCategoryID =
        categoryInfo
        and categoryInfo.parentCategoryID
        or 0

    local parentCategoryInfo =
        getCategoryInfo(
            parentCategoryID
        )

    return {
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
            categoryID,

        categoryName =
            categoryInfo
            and categoryInfo.name
            or nil,

        parentCategoryId =
            parentCategoryID,

        parentCategoryName =
            parentCategoryInfo
            and parentCategoryInfo.name
            or nil,

        baseDifficulty =
            getBaseDifficulty(
                resolvedRecipeID
            ),

        learned =
            recipeInfo.learned
            == true
    }
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
        local recipe =
            createCatalogRecipe(
                recipeID
            )

        if recipe
            and not seenRecipeIDs[
                recipe.recipeId
            ]
        then
            seenRecipeIDs[
                recipe.recipeId
            ] = true

            local learned =
                recipe.learned

            recipe.learned =
                nil

            table.insert(
                catalogRecipes,
                recipe
            )

            if learned then
                table.insert(
                    learnedRecipeIDs,
                    recipe.recipeId
                )
            end
        end
    end

    table.sort(
        catalogRecipes,
        function(
            left,
            right
        )
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

function PT.CreateOpenProfessionRecipeSnapshot(
    context
)
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