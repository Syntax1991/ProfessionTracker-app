local _, PT = ...

local function namesMatch(left, right)
    if not left or not right then
        return false
    end

    return PT.NormalizeKeyPart(left)
        == PT.NormalizeKeyPart(right)
end

local function professionsMatch(left, right)
    if not left or not right then
        return false
    end

    if left.skillLineId
        and left.skillLineId ~= 0
        and right.skillLineId
        and right.skillLineId ~= 0
    then
        return left.skillLineId
            == right.skillLineId
    end

    return namesMatch(
        left.name,
        right.name
    )
end

local function addCandidate(
    candidates,
    skillLineId,
    metadata
)
    local resolvedSkillLineId =
        tonumber(skillLineId)

    metadata =
        metadata
        or {}

    if not resolvedSkillLineId
        or resolvedSkillLineId == 0
        or not PT.IsTrackedProfessionExpansion(
            metadata
        )
    then
        return
    end

    local candidate =
        candidates[
            resolvedSkillLineId
        ]

    if not candidate then
        candidate = {
            skillLineId =
                resolvedSkillLineId
        }

        candidates[
            resolvedSkillLineId
        ] =
            candidate
    end

    candidate.displayName =
        metadata.displayName
        or candidate.displayName

    candidate.expansionName =
        metadata.expansionName
        or candidate.expansionName

    candidate.parentSkillLineId =
        metadata.parentSkillLineId
        or candidate.parentSkillLineId

    candidate.parentProfessionName =
        metadata.parentProfessionName
        or candidate.parentProfessionName
end

local function collectExpansionCandidates(
    candidates,
    profession
)
    for key, expansion in pairs(
        profession.expansions
        or {}
    ) do
        addCandidate(
            candidates,
            expansion.skillLineId
                or key,
            {
                displayName =
                    expansion.displayName,

                expansionName =
                    expansion.expansionName,

                parentSkillLineId =
                    profession.skillLineId,

                parentProfessionName =
                    profession.name
            }
        )
    end
end

local function collectStoredCandidates(
    candidates,
    profession,
    database
)
    collectExpansionCandidates(
        candidates,
        profession
    )

    for _, character in pairs(
        database.characters
        or {}
    ) do
        for _, storedProfession in ipairs(
            character.professions
            or {}
        ) do
            if professionsMatch(
                profession,
                storedProfession
            ) then
                collectExpansionCandidates(
                    candidates,
                    storedProfession
                )
            end
        end
    end
end

local function collectCatalogCandidates(
    candidates,
    profession,
    database
)
    for key, catalog in pairs(
        database.professionCatalog
        or {}
    ) do
        local matchesId =
            catalog.parentSkillLineId
            and profession.skillLineId
            and catalog.parentSkillLineId
                == profession.skillLineId

        local matchesName =
            namesMatch(
                catalog.parentProfessionName,
                profession.name
            )

        if matchesId or matchesName then
            addCandidate(
                candidates,
                catalog.skillLineId
                    or key,
                catalog
            )
        end
    end
end

local function getTradeSkillLineIds()
    local getter = nil

    if C_TradeSkillUI
        and C_TradeSkillUI.GetAllProfessionTradeSkillLines
    then
        getter =
            C_TradeSkillUI.GetAllProfessionTradeSkillLines
    elseif GetAllProfessionTradeSkillLines then
        getter =
            GetAllProfessionTradeSkillLines
    end

    if not getter then
        return {}
    end

    local success, result =
        pcall(getter)

    if not success
        or type(result) ~= "table"
    then
        return {}
    end

    return result
end

local function contextMatches(
    context,
    profession
)
    if not context then
        return false
    end

    if context.parentSkillLineId
        and context.parentSkillLineId ~= 0
        and profession.skillLineId
        and profession.skillLineId ~= 0
    then
        return context.parentSkillLineId
            == profession.skillLineId
    end

    return namesMatch(
        context.parentProfessionName,
        profession.name
    )
end

local function collectApiCandidates(
    candidates,
    profession
)
    if not PT.GetProfessionContextForSkillLine then
        return
    end

    local skillLineIds =
        getTradeSkillLineIds()

    for _, skillLineId in pairs(
        skillLineIds
    ) do
        if type(skillLineId) == "number" then
            local context =
                PT.GetProfessionContextForSkillLine(
                    skillLineId
                )

            if contextMatches(
                context,
                profession
            ) then
                addCandidate(
                    candidates,
                    skillLineId,
                    context
                )
            end
        end
    end
end

function PT.GetAutomaticProfessionCandidates(
    profession
)
    local database =
        PT.EnsureDatabase()

    local candidates = {}

    collectStoredCandidates(
        candidates,
        profession,
        database
    )

    collectCatalogCandidates(
        candidates,
        profession,
        database
    )

    collectApiCandidates(
        candidates,
        profession
    )

    return candidates
end