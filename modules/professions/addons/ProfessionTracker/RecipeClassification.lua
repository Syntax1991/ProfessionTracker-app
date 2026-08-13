local _, PT = ...

PT.RECIPE_SCOPE_VERSION = 1

local function getProfessionInfo(recipeID)
    if not C_TradeSkillUI
        or not C_TradeSkillUI.GetProfessionInfoByRecipeID
    then
        return nil
    end

    local success,
        info =
        pcall(
            C_TradeSkillUI.GetProfessionInfoByRecipeID,
            recipeID
        )

    if not success then
        return nil
    end

    return info
end

local function getSchematic(
    recipeID,
    isRecraft
)
    if not C_TradeSkillUI
        or not C_TradeSkillUI.GetRecipeSchematic
    then
        return nil
    end

    local success,
        schematic =
        pcall(
            C_TradeSkillUI.GetRecipeSchematic,
            recipeID,
            isRecraft == true
        )

    if not success then
        return nil
    end

    return schematic
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
        ==
        PT.NormalizeKeyPart(right)
end

local function parentMatches(
    professionInfo,
    context
)
    if not professionInfo
        or not context
    then
        return false
    end

    local recipeParentID =
        professionInfo.parentProfessionID

    local contextParentID =
        context.parentSkillLineId

    if recipeParentID
        and contextParentID
    then
        return recipeParentID
            == contextParentID
    end

    local recipeParentName =
        professionInfo.parentProfessionName
        or professionInfo.professionName

    return namesMatch(
        recipeParentName,
        context.parentProfessionName
    )
end

local function classifyScope(
    professionInfo,
    context
)
    if not professionInfo then
        return "UNKNOWN"
    end

    if professionInfo.professionID
        == context.skillLineId
    then
        return "CURRENT_EXPANSION"
    end

    if namesMatch(
        professionInfo.expansionName,
        context.expansionName
    )
        and parentMatches(
            professionInfo,
            context
        )
    then
        return "CURRENT_EXPANSION"
    end

    if professionInfo.professionID
        or professionInfo.expansionName
        or professionInfo.parentProfessionID
    then
        return "OTHER_EXPANSION"
    end

    return "UNKNOWN"
end

function PT.ClassifyRecipeForContext(
    recipeID,
    recipeInfo,
    context
)
    if not recipeID
        or not recipeInfo
        or not context
    then
        return nil
    end

    local professionInfo =
        getProfessionInfo(
            recipeID
        )

    local isDummyRecipe =
        recipeInfo.isDummyRecipe
        == true

    local isRecraft =
        recipeInfo.isRecraft
        == true

    local schematic =
        getSchematic(
            recipeID,
            isRecraft
        )

    if schematic
        and schematic.isRecraft
    then
        isRecraft = true
    end

    local scopeStatus =
        classifyScope(
            professionInfo,
            context
        )

    local exclusionReason =
        nil

    if isDummyRecipe then
        exclusionReason =
            "DUMMY_RECIPE"
    elseif isRecraft then
        exclusionReason =
            "RECRAFT_ENTRY"
    elseif scopeStatus == "OTHER_EXPANSION" then
        exclusionReason =
            "OTHER_EXPANSION"
    end

    local hasCraftingOperationInfo =
        schematic
        and schematic.hasCraftingOperationInfo
        == true
        or false

    return {
        includeInCatalog =
            exclusionReason
            == nil,

        exclusionReason =
            exclusionReason,

        scopeStatus =
            scopeStatus,

        recipeProfessionId =
            professionInfo
            and professionInfo.professionID
            or nil,

        recipeParentProfessionId =
            professionInfo
            and professionInfo.parentProfessionID
            or nil,

        recipeExpansionName =
            professionInfo
            and professionInfo.expansionName
            or nil,

        hasCraftingOperationInfo =
            hasCraftingOperationInfo,

        isDummyRecipe =
            isDummyRecipe,

        isRecraft =
            isRecraft
    }
end