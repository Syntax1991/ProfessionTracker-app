local _, PT = ...

local CAPTURE_VERSION = 2

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

local function getCatalogRecipeMap(skillLineID)
    local database =
        PT.EnsureDatabase()

    local catalog =
        database.recipeCatalog[
            tostring(skillLineID)
        ]

    local result = {}

    if not catalog
        or type(catalog.recipes) ~= "table"
    then
        return result
    end

    for _, recipe in ipairs(
        catalog.recipes
    ) do
        if recipe.recipeId then
            result[
                recipe.recipeId
            ] =
                recipe
        end
    end

    return result
end

local function collectRecipeOperations(
    skillLineID,
    learnedRecipeIDs
)
    local catalogRecipes =
        getCatalogRecipeMap(
            skillLineID
        )

    local storedRecipes = {}
    local unavailableRecipeIDs = {}
    local operationRecipeCount = 0

    for _, recipeID in ipairs(
        learnedRecipeIDs
    ) do
        local recipe =
            catalogRecipes[
                recipeID
            ]

        local operationMetrics =
            recipe
            and copyScalarMetrics(
                recipe.operationMetrics
            )
            or nil

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
        else
            table.insert(
                unavailableRecipeIDs,
                recipeID
            )
        end
    end

    table.sort(
        unavailableRecipeIDs
    )

    return storedRecipes,
        unavailableRecipeIDs,
        operationRecipeCount
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

function PT.GetCharacterRecipeOperationStore(
    characterKey
)
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

    local storedRecipes,
        unavailableRecipeIDs,
        operationRecipeCount =
        collectRecipeOperations(
            context.skillLineId,
            learnedRecipeIDs
        )

    local learnedRecipeCount =
        #learnedRecipeIDs

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

        operationAttemptedCount =
            learnedRecipeCount,

        operationRecipeCount =
            operationRecipeCount,

        operationUnavailableCount =
            #unavailableRecipeIDs,

        operationUnavailableRecipeIds =
            unavailableRecipeIDs,

        captureLevel =
            "OPERATIONS",

        status =
            "CAPTURED",

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
    function PT.CreateOpenProfessionRecipeSnapshot(
        context
    )
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