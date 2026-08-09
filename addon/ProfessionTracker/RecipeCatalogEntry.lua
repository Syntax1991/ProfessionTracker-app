local _, PT = ...

local function getRecipeInfo(recipeID)
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

local function getCategoryInfo(categoryID)
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

local function getOperationMetrics(recipeID)
    if not PT.GetRecipeOperationSnapshot then
        return nil
    end

    return PT.GetRecipeOperationSnapshot(
        recipeID
    )
end

function PT.CreateRecipeCatalogEntry(
    recipeID,
    context
)
    local recipeInfo =
        getRecipeInfo(
            recipeID
        )

    if not recipeInfo then
        return nil,
            "NO_RECIPE_INFO"
    end

    local resolvedRecipeID =
        recipeInfo.recipeID
        or recipeID

    if not resolvedRecipeID then
        return nil,
            "NO_RECIPE_ID"
    end

    local classification =
        PT.ClassifyRecipeForContext(
            resolvedRecipeID,
            recipeInfo,
            context
        )

    if not classification then
        return nil,
            "NO_CLASSIFICATION"
    end

    if not classification.includeInCatalog then
        return nil,
            classification.exclusionReason
            or "EXCLUDED"
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

    local operationMetrics =
        getOperationMetrics(
            resolvedRecipeID
        )

    local operationEligible =
        classification.hasCraftingOperationInfo
        or operationMetrics ~= nil

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

        skillLineAbilityId =
            recipeInfo.skillLineAbilityID,

        scopeStatus =
            classification.scopeStatus,

        recipeProfessionId =
            classification.recipeProfessionId,

        recipeParentProfessionId =
            classification.recipeParentProfessionId,

        recipeExpansionName =
            classification.recipeExpansionName,

        supportsQualities =
            recipeInfo.supportsQualities
            == true,

        supportsCraftingStats =
            recipeInfo.supportsCraftingStats
            == true,

        hasCraftingOperationInfo =
            classification.hasCraftingOperationInfo,

        operationEligible =
            operationEligible,

        baseDifficulty =
            operationMetrics
            and operationMetrics.baseDifficulty
            or nil,

        operationMetrics =
            operationMetrics,

        learned =
            recipeInfo.learned
            == true
    },
        nil
end