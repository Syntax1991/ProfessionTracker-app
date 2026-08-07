local _, PT = ...

local function collectEntries(
    configID,
    entryIDs
)
    local entries = {}

    for _, entryID in ipairs(
        entryIDs
        or {}
    ) do
        local entry =
            PT.CollectProfessionTraitEntry(
                configID,
                entryID
            )

        table.insert(
            entries,
            entry
        )
    end

    return entries
end

function PT.CollectProfessionTraitNode(
    configID,
    nodeID
)
    if not C_Traits
        or not C_Traits.GetNodeInfo
    then
        return nil
    end

    local nodeInfo =
        C_Traits.GetNodeInfo(
            configID,
            nodeID
        )

    if not nodeInfo
        or not nodeInfo.ID
        or nodeInfo.ID == 0
    then
        return nil
    end

    local activeEntryID = nil
    local activeEntryRank = 0

    if nodeInfo.activeEntry then
        activeEntryID =
            nodeInfo.activeEntry.entryID

        activeEntryRank =
            nodeInfo.activeEntry.rank
            or 0
    end

    return {
        nodeId =
            nodeID,
        type =
            nodeInfo.type,
        posX =
            nodeInfo.posX
            or 0,
        posY =
            nodeInfo.posY
            or 0,
        isVisible =
            nodeInfo.isVisible
            == true,
        isAvailable =
            nodeInfo.isAvailable
            == true,
        meetsEdgeRequirements =
            nodeInfo.meetsEdgeRequirements
            == true,
        canPurchaseRank =
            nodeInfo.canPurchaseRank
            == true,
        canRefundRank =
            nodeInfo.canRefundRank
            == true,
        ranksPurchased =
            nodeInfo.ranksPurchased
            or 0,
        activeRank =
            nodeInfo.activeRank
            or 0,
        currentRank =
            nodeInfo.currentRank
            or 0,
        maxRanks =
            nodeInfo.maxRanks
            or 0,
        totalMaxRanks =
            nodeInfo.totalMaxRanks
            or nodeInfo.maxRanks
            or 0,
        activeEntryId =
            activeEntryID,
        activeEntryRank =
            activeEntryRank,
        conditionIds =
            PT.CopyNumberArray(
                nodeInfo.conditionIDs
            ),
        entries =
            collectEntries(
                configID,
                nodeInfo.entryIDs
            )
    }
end

function PT.CollectProfessionTraitCurrencies(
    configID,
    treeID
)
    if not C_Traits
        or not C_Traits.GetTreeCurrencyInfo
    then
        return {}
    end

    local currencyInfos =
        C_Traits.GetTreeCurrencyInfo(
            configID,
            treeID,
            true
        )
        or {}

    local currencies = {}

    for _, currencyInfo in ipairs(
        currencyInfos
    ) do
        table.insert(
            currencies,
            {
                traitCurrencyId =
                    currencyInfo.traitCurrencyID,
                quantity =
                    currencyInfo.quantity
                    or 0,
                maxQuantity =
                    currencyInfo.maxQuantity,
                spent =
                    currencyInfo.spent
                    or 0
            }
        )
    end

    return currencies
end