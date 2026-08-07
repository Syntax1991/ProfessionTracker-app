local _, PT = ...

local function collectRootPath(
    treeID,
    configID
)
    if not C_ProfSpecs
        or not C_ProfSpecs.GetRootPathForTab
    then
        return nil
    end

    local rootPathID =
        C_ProfSpecs.GetRootPathForTab(
            treeID
        )

    if not rootPathID
        or rootPathID == 0
    then
        return nil
    end

    local result = {
        id =
            rootPathID
    }

    if C_ProfSpecs.GetStateForPath then
        result.state =
            C_ProfSpecs.GetStateForPath(
                rootPathID,
                configID
            )
    end

    if C_ProfSpecs.GetDescriptionForPath then
        result.description =
            C_ProfSpecs.GetDescriptionForPath(
                rootPathID
            )
    end

    if C_ProfSpecs.GetSourceTextForPath then
        result.source =
            C_ProfSpecs.GetSourceTextForPath(
                rootPathID,
                configID
            )
    end

    return result
end

local function collectNodes(
    configID,
    treeID
)
    if not C_Traits
        or not C_Traits.GetTreeNodes
    then
        return {}
    end

    local nodeIDs =
        C_Traits.GetTreeNodes(
            treeID
        )
        or {}

    local nodes = {}

    for _, nodeID in ipairs(
        nodeIDs
    ) do
        local node =
            PT.CollectProfessionTraitNode(
                configID,
                nodeID
            )

        if node then
            table.insert(
                nodes,
                node
            )
        end
    end

    return nodes
end

function PT.CollectProfessionTraitTab(
    configID,
    treeID
)
    local tabInfo = nil

    if C_ProfSpecs
        and C_ProfSpecs.GetTabInfo
    then
        tabInfo =
            C_ProfSpecs.GetTabInfo(
                treeID
            )
    end

    local tab = {
        treeId =
            treeID,
        currencies =
            PT.CollectProfessionTraitCurrencies(
                configID,
                treeID
            ),
        nodes =
            collectNodes(
                configID,
                treeID
            )
    }

    if C_ProfSpecs
        and C_ProfSpecs.GetStateForTab
    then
        tab.state =
            C_ProfSpecs.GetStateForTab(
                treeID,
                configID
            )
    end

    if tabInfo then
        tab.name =
            tabInfo.name

        tab.description =
            tabInfo.description

        tab.rootNodeId =
            tabInfo.rootNodeID

        tab.icon =
            tabInfo.rootIconID
    end

    local rootPath =
        collectRootPath(
            treeID,
            configID
        )

    if rootPath then
        tab.rootPath =
            rootPath
    end

    return tab
end