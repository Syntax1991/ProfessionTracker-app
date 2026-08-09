local _, PT = ...

local CAPTURE_VERSION = 1

PT.CHARACTER_RECIPE_OPERATION_CAPTURE_VERSION =
    CAPTURE_VERSION

local originalCreateOpenProfessionRecipeSnapshot =
    PT.CreateOpenProfessionRecipeSnapshot

local function copyScalarMetrics(metrics)
    if type(metrics) ~= "table" then
        return nil
    end

    local result = {}

    for key, value in pairs(metrics) do
        local valueType =
            type(value)

        if type(key) == "string"
            and (
                valueType == "number"
                or valueType == "string"
                or valueType == "boolean"
            )
        then
            result[key] =
                value
        end
    end

    if next(result) == nil then
        return nil
    end

    return result
end

local function createLearnedRecipeSet(recipeIDs)
    local result = {}

    for _, recipeID in ipairs(
        recipeIDs
        or {}
    ) do
        if recipeID then
            result[recipeID] =
                true
        end
    end

    return result
end

local function getCatalogRecipes(skillLineID)
    local database =
        PT.EnsureDatabase()

    local catalog =
        database.recipeCatalog[
            tostring(skillLineID)
        ]

    if not catalog
        or type(catalog.recipes) ~= "table"
    then
        return {}
    end

    return catalog.recipes
end

function PT.GetCurrentCharacterStorageKey()
    local characterName =
        UnitName("player")
        or "unknown"

    return table.concat(
        {
            PT.NormalizeKeyPart(
                PT.GetRegion()
            ),
            PT.NormalizeKeyPart(
                PT.GetRealm()
            ),
            PT.NormalizeKeyPart(
                characterName
            )
        },
        ":"
    )
end

function PT.GetCharacterRecipeOperationStore(characterKey)
    local database =
        PT.EnsureDatabase()

    local resolvedKey =
        characterKey
        or PT.GetCurrentCharacterStorageKey()

    database.characterRecipeOperations[
        resolvedKey
    ] =
        database.characterRecipeOperations[
            resolvedKey
        ]
        or {}

    return database.characterRecipeOperations[
        resolvedKey
    ]
end

function PT.StoreCharacterRecipeOperations(
    context,
    recipeSnapshot
)
    if not context
        or not context.skillLineId
        or not recipeSnapshot
    then
        return nil
    end

    local learnedRecipeIDs =
        recipeSnapshot.learnedRecipeIds
        or {}

    local learnedRecipeSet =
        createLearnedRecipeSet(
            learnedRecipeIDs
        )

    local storedRecipes = {}
    local operationRecipeCount = 0

    for _, recipe in ipairs(
        getCatalogRecipes(
            context.skillLineId
        )
    ) do
        local recipeID =
            recipe.recipeId

        if recipeID
            and learnedRecipeSet[recipeID]
        then
            local operationMetrics =
                copyScalarMetrics(
                    recipe.operationMetrics
                )

            if operationMetrics then
                storedRecipes[
                    tostring(recipeID)
                ] = {
                    recipeId =
                        recipeID,

                    operationMetrics =
                        operationMetrics
                }

                operationRecipeCount =
                    operationRecipeCount + 1
            end
        end
    end

    local learnedRecipeCount =
        #learnedRecipeIDs

    local isComplete =
        learnedRecipeCount > 0
        and operationRecipeCount
            == learnedRecipeCount

    local capture = {
        captureVersion =
            CAPTURE_VERSION,

        characterKey =
            PT.GetCurrentCharacterStorageKey(),

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

        learnedRecipeCount =
            learnedRecipeCount,

        operationRecipeCount =
            operationRecipeCount,

        captureLevel =
            isComplete
            and "OPERATIONS"
            or "RECIPES",

        status =
            isComplete
            and "COMPLETE"
            or "PARTIAL",

        capturedAt =
            recipeSnapshot.capturedAt
            or time(),

        recipes =
            storedRecipes
    }

    local characterStore =
        PT.GetCharacterRecipeOperationStore(
            capture.characterKey
        )

    characterStore[
        tostring(context.skillLineId)
    ] =
        capture

    return capture
end

if type(
    originalCreateOpenProfessionRecipeSnapshot
) == "function"
then
    function PT.CreateOpenProfessionRecipeSnapshot(context)
        local recipeSnapshot =
            originalCreateOpenProfessionRecipeSnapshot(
                context
            )

        if not recipeSnapshot then
            return nil
        end

        local capture =
            PT.StoreCharacterRecipeOperations(
                context,
                recipeSnapshot
            )

        if capture
            and PT.OnCharacterRecipeOperationsCaptured
        then
            PT.OnCharacterRecipeOperationsCaptured(
                capture
            )
        end

        return recipeSnapshot
    end
end