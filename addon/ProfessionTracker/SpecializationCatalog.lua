local _, PT = ...

local function copyArray(values)
    if PT.CopyNumberArray then
        return PT.CopyNumberArray(
            values
        )
    end

    local result = {}

    for _, value in ipairs(
        values
        or {}
    ) do
        table.insert(
            result,
            value
        )
    end

    return result
end

local function createCatalogEntry(entry)
    return {
        entryId =
            entry.entryId,
        type =
            entry.type,
        maxRanks =
            entry.maxRanks
            or 0,
        definitionId =
            entry.definitionId,
        spellId =
            entry.spellId,
        name =
            entry.name,
        subtext =
            entry.subtext,
        description =
            entry.description,
        icon =
            entry.icon,
        subType =
            entry.subType,
        conditionIds =
            copyArray(
                entry.conditionIds
            )
    }
end

local function createCatalogNode(node)
    local entries = {}

    for _, entry in ipairs(
        node.entries
        or {}
    ) do
        table.insert(
            entries,
            createCatalogEntry(
                entry
            )
        )
    end

    return {
        nodeId =
            node.nodeId,
        type =
            node.type,
        posX =
            node.posX
            or 0,
        posY =
            node.posY
            or 0,
        maxRanks =
            node.maxRanks
            or 0,
        totalMaxRanks =
            node.totalMaxRanks
            or node.maxRanks
            or 0,
        conditionIds =
            copyArray(
                node.conditionIds
            ),
        entries =
            entries
    }
end

local function createRootPath(rootPath)
    if not rootPath then
        return nil
    end

    return {
        id =
            rootPath.id,
        description =
            rootPath.description,
        source =
            rootPath.source
    }
end

local function createCatalogTab(tab)
    local nodes = {}

    for _, node in ipairs(
        tab.nodes
        or {}
    ) do
        table.insert(
            nodes,
            createCatalogNode(
                node
            )
        )
    end

    return {
        treeId =
            tab.treeId,
        name =
            tab.name,
        description =
            tab.description,
        rootNodeId =
            tab.rootNodeId,
        icon =
            tab.icon,
        rootPath =
            createRootPath(
                tab.rootPath
            ),
        nodes =
            nodes
    }
end

local function createCatalog(
    specializationData
)
    local tabs = {}

    for _, tab in ipairs(
        specializationData.tabs
        or {}
    ) do
        table.insert(
            tabs,
            createCatalogTab(
                tab
            )
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
        hasSpecialization =
            specializationData.hasSpecialization,
        tabs =
            tabs,
        updatedAt =
            specializationData.capturedAt
            or time()
    }
end

function PT.StoreProfessionCatalog(
    specializationData
)
    if not specializationData
        or not specializationData.skillLineId
    then
        return
    end

    local database =
        PT.EnsureDatabase()

    local catalogKey =
        tostring(
            specializationData.skillLineId
        )

    database.professionCatalog[
        catalogKey
    ] =
        createCatalog(
            specializationData
        )
end