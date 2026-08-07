local _, PT = ...

local function createNodeState(node)
    local ranksPurchased =
        node.ranksPurchased
        or 0

    local currentRank =
        node.currentRank
        or 0

    local activeRank =
        node.activeRank
        or 0

    local activeEntryRank =
        node.activeEntryRank
        or 0

    if ranksPurchased == 0
        and currentRank == 0
        and activeRank == 0
        and activeEntryRank == 0
    then
        return nil
    end

    return {
        ranksPurchased =
            ranksPurchased,
        currentRank =
            currentRank,
        activeRank =
            activeRank,
        activeEntryId =
            node.activeEntryId,
        activeEntryRank =
            activeEntryRank
    }
end

local function createCurrencyState(
    currency
)
    local quantity =
        currency.quantity
        or 0

    local spent =
        currency.spent
        or 0

    local maxQuantity =
        currency.maxQuantity
        or 0

    if quantity == 0
        and spent == 0
        and maxQuantity == 0
    then
        return nil
    end

    return {
        traitCurrencyId =
            currency.traitCurrencyId,
        quantity =
            quantity,
        spent =
            spent,
        maxQuantity =
            maxQuantity
    }
end

local function createNodeRanks(nodes)
    local nodeRanks = {}

    for _, node in ipairs(
        nodes
        or {}
    ) do
        local nodeState =
            createNodeState(
                node
            )

        if nodeState then
            nodeRanks[
                tostring(
                    node.nodeId
                )
            ] =
                nodeState
        end
    end

    return nodeRanks
end

local function createCurrencies(
    sourceCurrencies
)
    local currencies = {}

    for _, currency in ipairs(
        sourceCurrencies
        or {}
    ) do
        local currencyState =
            createCurrencyState(
                currency
            )

        if currencyState then
            table.insert(
                currencies,
                currencyState
            )
        end
    end

    return currencies
end

local function createTabState(tab)
    return {
        treeId =
            tab.treeId,
        state =
            tab.state,
        rootPathState =
            tab.rootPath
            and tab.rootPath.state
            or nil,
        nodeRanks =
            createNodeRanks(
                tab.nodes
            ),
        currencies =
            createCurrencies(
                tab.currencies
            )
    }
end

local function createTabStates(tabs)
    local tabStates = {}

    for _, tab in ipairs(
        tabs
        or {}
    ) do
        table.insert(
            tabStates,
            createTabState(
                tab
            )
        )
    end

    return tabStates
end

function PT.CreateCompactExpansionSnapshot(
    specializationData
)
    if not specializationData
        or not specializationData.skillLineId
    then
        return nil
    end

    if PT.StoreProfessionCatalog then
        PT.StoreProfessionCatalog(
            specializationData
        )
    end

    return {
        skillLineId =
            specializationData.skillLineId,
        displayName =
            specializationData.displayName,
        expansionName =
            specializationData.expansionName,
        configId =
            specializationData.configId,
        available =
            specializationData.available,
        hasSpecialization =
            specializationData.hasSpecialization,
        knowledge =
            specializationData.knowledge,
        tabStates =
            createTabStates(
                specializationData.tabs
            ),
        capturedAt =
            specializationData.capturedAt
    }
end

function PT.CompactStoredExpansion(
    expansion
)
    if not expansion then
        return nil
    end

    if not expansion.specializations then
        return expansion
    end

    local legacyData = {
        skillLineId =
            expansion.skillLineId,
        displayName =
            expansion.displayName,
        expansionName =
            expansion.expansionName,
        configId =
            expansion.configId,
        available =
            expansion.available,
        hasSpecialization =
            expansion.hasSpecialization,
        knowledge =
            expansion.knowledge,
        capturedAt =
            expansion.capturedAt,
        tabs =
            expansion.specializations
            or {}
    }

    return PT.CreateCompactExpansionSnapshot(
        legacyData
    )
end

function PT.CompactStoredExpansions(
    expansions
)
    local compacted = {}

    for key, expansion in pairs(
        expansions
        or {}
    ) do
        local compactExpansion =
            PT.CompactStoredExpansion(
                expansion
            )

        if compactExpansion then
            compacted[key] =
                compactExpansion
        end
    end

    return compacted
end