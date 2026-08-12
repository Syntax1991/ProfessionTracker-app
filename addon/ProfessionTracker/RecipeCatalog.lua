local _, PT = ...

local function incrementReason(
    reasons,
    reason
)
    local key =
        reason
        or "UNKNOWN"

    reasons[key] =
        (
            reasons[key]
            or 0
        ) + 1
end

local function collectRecipes(context)
    if not C_TradeSkillUI
        or not C_TradeSkillUI.GetAllRecipeIDs
        or not PT.CreateRecipeCatalogEntry
    then
        return nil
    end

    local sourceRecipeIDs =
        C_TradeSkillUI.GetAllRecipeIDs()
        or {}

    local catalogRecipes = {}
    local learnedRecipeIDs = {}
    local operationEligibleRecipeIDs = {}
    local seenRecipeIDs = {}
    local excludedByReason = {}

    for _, recipeID in ipairs(
        sourceRecipeIDs
    ) do
        local recipe,
            exclusionReason =
            PT.CreateRecipeCatalogEntry(
                recipeID,
                context
            )

        if not recipe then
            incrementReason(
                excludedByReason,
                exclusionReason
            )
        elseif not seenRecipeIDs[
            recipe.recipeId
        ] then
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

                if recipe.operationEligible then
                    table.insert(
                        operationEligibleRecipeIDs,
                        recipe.recipeId
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

    table.sort(
        operationEligibleRecipeIDs
    )

    return {
        recipes =
            catalogRecipes,

        learnedRecipeIds =
            learnedRecipeIDs,

        operationEligibleRecipeIds =
            operationEligibleRecipeIDs,

        sourceRecipeCount =
            #sourceRecipeIDs,

        excludedRecipeCount =
            #sourceRecipeIDs
            - #catalogRecipes,

        excludedByReason =
            excludedByReason
    }
end

local function storeRecipeCatalog(
    context,
    collection,
    capturedAt
)
    if not PT.IsTrackedProfessionContext(
        context
    ) then
        return
    end

    local database =
        PT.EnsureDatabase()

    local catalogKey =
        tostring(
            context.skillLineId
        )

    database.recipeCatalog[
        catalogKey
    ] = {
        scopeVersion =
            PT.RECIPE_SCOPE_VERSION
            or 1,

        skillLineId =
            context.skillLineId,

        displayName =
            context.displayName,

        expansionName =
            context.expansionName,

        sourceRecipeCount =
            collection.sourceRecipeCount,

        excludedRecipeCount =
            collection.excludedRecipeCount,

        excludedByReason =
            collection.excludedByReason,

        recipes =
            collection.recipes,

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
        or not PT.IsTrackedProfessionContext(
            context
        )
    then
        return nil
    end

    local collection =
        collectRecipes(
            context
        )

    if not collection
        or #collection.recipes == 0
    then
        return nil
    end

    local capturedAt =
        time()

    storeRecipeCatalog(
        context,
        collection,
        capturedAt
    )

    return {
        scopeVersion =
            PT.RECIPE_SCOPE_VERSION
            or 1,

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
            #collection.recipes,

        learnedRecipeIds =
            collection.learnedRecipeIds,

        operationEligibleRecipeIds =
            collection.operationEligibleRecipeIds,

        sourceRecipeCount =
            collection.sourceRecipeCount,

        excludedRecipeCount =
            collection.excludedRecipeCount,

        excludedByReason =
            collection.excludedByReason,

        capturedAt =
            capturedAt
    }
end